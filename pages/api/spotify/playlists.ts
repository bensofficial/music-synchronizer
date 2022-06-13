import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";
import getAllPlaylists from "$lib/services/spotify/api/getPlaylists";
import { Playlist } from "$lib/services/types";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const user = await prisma.user.findFirst({
		where: {
			id: sessionData.user.id,
		},
	});

	try {
		const playlists = await getAllPlaylists(user!);

		playlists.sort((a: Playlist, b: Playlist) =>
			a.title.localeCompare(b.title),
		);

		return res.status(200).send(playlists);
	} catch (e) {
		if (e instanceof Error) {
			return res.status(500).send({ errors: [{ message: e.message }] });
		}
	}
});
