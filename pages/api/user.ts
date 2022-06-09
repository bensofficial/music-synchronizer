import { apiRequireAuth } from "$lib/auth";
import { getUserWithoutDatesAndPassword } from "$lib/db/user";
import prisma from "$lib/prisma";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const user = await getUserWithoutDatesAndPassword(sessionData.user.id);

	if (!user) {
		return res.status(400).json({ errors: [{ message: "No User found" }] });
	}

	return res.status(200).send(user);
});
