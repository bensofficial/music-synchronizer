import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const user = await prisma.user.findUnique({
		where: { id: sessionData.user.id },
		select: {
			id: true,
			email: true,
			username: true,
			spotifyAccessToken: true,
			spotifyRefreshToken: true,
		},
	});

	if (!user) {
		res.status(400).json({ errors: [{ message: "No User found" }] });
	}

	return res.status(200).send(user);
});
