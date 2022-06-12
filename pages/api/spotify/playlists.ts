import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";
import getPlaylists from "$lib/services/spotify/api/getPlaylists";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const user = await prisma.user.findFirst({
		where: {
			id: sessionData.user.id,
		},
	});

	const accessToken = user?.spotifyAccessToken;
	const userId = user?.spotifyUserId;

	const playlist = await getPlaylists(user!);

	return res.status(200).send(playlist);
});
