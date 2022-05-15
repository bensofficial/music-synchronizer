import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";
import getPlaylists from "$lib/services/youtube/api/getPlaylists";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const user = await prisma.user.findUnique({
		where: { id: sessionData.user.id },
	});

	if (!user) {
		return res.status(400).json({ errors: [{ message: "No User found" }] });
	}

	const playlists = await getPlaylists(user);

	return res.status(200).send(playlists);
});
