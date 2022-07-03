import { DisplayPlaylist, Playlist } from "./types";
import prisma from "lib/prisma";

export async function playlistsToDisplayPlaylists(
	userId: number,
	playlists: Playlist[],
): Promise<DisplayPlaylist[]> {
	const userPlaylists = await prisma.playlist.findMany({
		where: {
			userId,
		},
	});

	return await Promise.all(
		playlists.map(async ({ serviceId, title, type }) => {
			const userPlaylist = userPlaylists.find(
				(uP) => uP.serviceId === serviceId,
			);

			if (!userPlaylist) {
				await createPlaylist(userId, serviceId);
			}

			return {
				serviceId,
				title,
				type,
				lastSynchronized:
					userPlaylist === undefined
						? null
						: userPlaylist.lastSynchronized,
			};
		}),
	);
}

async function createPlaylist(userId: number, playlistId: string) {
	try {
		await prisma.playlist.create({
			data: {
				userId,
				serviceId: playlistId,
			},
		});
	} catch {}
}

export async function updateLastSynchronized(
	playlistId: string,
	userId: number,
) {
	if (
		(await prisma.playlist.findUnique({
			where: { serviceId: playlistId },
		})) === null
	) {
		return await prisma.playlist.create({
			data: {
				userId,
				serviceId: playlistId,
				lastSynchronized: new Date(),
			},
		});
	}

	await prisma.playlist.update({
		where: {
			serviceId: playlistId,
		},
		data: {
			lastSynchronized: new Date(),
		},
	});
}
