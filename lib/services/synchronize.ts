import { User } from "@prisma/client";
import getSongIdForService from "./cache";
import Service, { Playlist } from "./types";
import addToPlaylist from "./youtube/api/addToPlaylist";
import deleteFromPlaylist from "./youtube/api/deleteFromPlaylist";

export default async function synchronizePlaylist(
	user: User,
	originPlaylist: Playlist,
	originService: Service,
	destinationService: Service,
) {
	const destinationPlaylistId =
		(await destinationService.getPlaylistId(user, originPlaylist.title)) ??
		(await destinationService.createPlaylist(user, originPlaylist.title));

	const originSongs = await originService.getSongsInPlaylist(
		user,
		originPlaylist.serviceId,
	);

	const destinationSongs = await destinationService.getSongsInPlaylist(
		user,
		destinationPlaylistId,
	);

	const originSongsMap = await Promise.all(
		originSongs.map(async (song) => {
			return {
				originId: song.serviceId,
				destinationId: await getSongIdForService(
					song,
					originService,
					destinationService,
				),
			};
		}),
	);

	const destinationSongsMap = await Promise.all(
		destinationSongs.map(async (song) => {
			return {
				destinationId: song.serviceId,
				originId: await getSongIdForService(
					song,
					destinationService,
					originService,
				),
			};
		}),
	);

	const toBeDeleted = destinationSongsMap.filter(
		(song) => !originSongsMap.includes(song),
	);
	const toBeAdded = originSongsMap.filter(
		(song) => !destinationSongsMap.includes(song),
	);

	toBeDeleted.forEach((song) =>
		deleteFromPlaylist(user, destinationPlaylistId, song.destinationId),
	);
	toBeAdded.forEach((song) =>
		addToPlaylist(user, destinationPlaylistId, song.destinationId),
	);
}
