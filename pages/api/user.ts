import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";

export default apiRequireAuth(async (_req, res, sessionUser) => {
	const user = await prisma.user.findUnique({
		where: { id: sessionUser.id },
	});

	if (!user) {
		res.status(400).json({ errors: [{ message: "No User found" }] });
	}

	return res.status(200).send(user);
});
