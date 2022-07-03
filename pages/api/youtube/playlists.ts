import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";
import { playlistsToDisplayPlaylists } from "$lib/services/playlist";
import { Playlist } from "$lib/services/types";
import { getAllPlaylists } from "$lib/services/youtube/api/getPlaylists";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const user = await prisma.user.findUnique({
		where: { id: sessionData.user.id },
	});

	if (!user) {
		return res.status(400).json({ errors: [{ message: "No User found" }] });
	}

	try {
		let playlists = await getAllPlaylists(user);

		playlists.sort((a: Playlist, b: Playlist) =>
			a.title.localeCompare(b.title),
		);

		playlists = await playlistsToDisplayPlaylists(user.id, playlists);

		return res.status(200).send(playlists);
	} catch (e) {
		if (e instanceof Error) {
			return res.status(500).send({ errors: [{ message: e.message }] });
		}
	}
});
