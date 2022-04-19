import { apiWithSession, hashPassword } from "$lib/auth";
import prisma from "$lib/prisma";
import { email, password } from "$lib/validation/rules";
import schema from "$lib/validation/Schema";

const requestData = schema({
	email: email(),
	password: password(),
});

export default apiWithSession(async (req, res, session) => {
	if (!requestData.validate(req, res)) {
		return;
	}

	const data = req.body;

	if (await prisma.user.findUnique({ where: { email: data.email } })) {
		return res
			.status(400)
			.json({ errors: [{ message: "Email is already used" }] });
	}

	const newUser = await prisma.user.create({
		data: {
			email: data.email,
			password: await hashPassword(data.password),
		},
	});

	await session.save({ user: { id: newUser.id } });

	return res.status(200).json({});
});
