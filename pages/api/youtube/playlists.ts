import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";
import { Playlist } from "$lib/services/types";
import { getAllPlaylists } from "$lib/services/youtube/api/getPlaylists";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const user = await prisma.user.findUnique({
		where: { id: sessionData.user.id },
	});

	if (!user) {
		return res.status(400).json({ errors: [{ message: "No User found" }] });
	}

	const result = await getAllPlaylists(user);

	if (result instanceof Error) {
		return res.status(500).json({ errors: [{ message: result.message }] });
	}

	result.sort((a: Playlist, b: Playlist) => a.title.localeCompare(b.title));

	return res.status(200).send(result);
});
