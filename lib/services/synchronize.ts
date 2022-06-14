import { User } from "@prisma/client";
import getSongIdForService from "./cache";
import Service, { Playlist } from "./types";

export default async function synchronizePlaylist(
	user: User,
	originPlaylist: Playlist,
	destinationPlaylistId: string,
	originService: Service,
	destinationService: Service,
) {
	if (destinationPlaylistId === "create") {
		destinationPlaylistId = await destinationService.createPlaylist(
			user,
			originPlaylist.title,
		);
	}

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

	destinationService.deleteFromPlaylist(
		user,
		destinationPlaylistId,
		toBeDeleted.map((song) => song.destinationId),
	);

	destinationService.addToPlaylist(
		user,
		destinationPlaylistId,
		toBeAdded.map((song) => song.destinationId),
	);
}
