import { SongIdMap, User } from "@prisma/client";
import getSongIdForService from "./cache";
import Service from "./types";

export default async function synchronizePlaylist(
	user: User,
	originPlaylistId: string,
	destinationPlaylistId: string,
	originService: Service,
	destinationService: Service,
) {
	const originPlaylist = await originService.getPlaylist(
		user,
		originPlaylistId,
	);

	if (!originPlaylist) {
		throw new Error("Origin playlist does not exist");
	}

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

	const originSongsMap = (
		await Promise.all(
			originSongs.map(async (song) => {
				const destinationId = await getSongIdForService(
					user,
					song,
					originService,
					destinationService,
				);

				if (!destinationId) {
					return null;
				}

				return {
					originId: song.serviceId,
					destinationId,
				};
			}),
		)
	).filter((s) => s != null);

	const destinationSongsMap = (
		await Promise.all(
			destinationSongs.map(async (song) => {
				const originId = await getSongIdForService(
					user,
					song,
					destinationService,
					originService,
				);

				if (!originId) {
					return null;
				}

				return {
					destinationId: song.serviceId,
					originId,
				};
			}),
		)
	).filter((s) => s != null);

	// delete all songs that are not in the originSongsMap
	const toBeDeleted = destinationSongsMap.filter(
		(song) =>
			originSongsMap.find(
				(s) =>
					s?.originId === song?.originId &&
					s?.destinationId === song?.destinationId,
			) == null,
	);
	// add all songs that are not in the destinationSongsMap
	const toBeAdded = originSongsMap.filter(
		(song) =>
			destinationSongsMap.find(
				(s) =>
					s?.originId === song?.originId &&
					s?.destinationId === song?.destinationId,
			) == null,
	);

	if (toBeDeleted.length > 0) {
		destinationService.deleteFromPlaylist(
			user,
			destinationPlaylistId,
			toBeDeleted.map((song) => song!.destinationId),
		);
	}

	if (toBeAdded.length > 0) {
		destinationService.addToPlaylist(
			user,
			destinationPlaylistId,
			toBeAdded.map((song) => song!.destinationId),
		);
	}
}
