import { apiWithSession, hashPassword } from "$lib/auth";
import prisma from "$lib/prisma";
import { email, password } from "$lib/validation/rules";
import schema from "$lib/validation/Schema";

const requestData = schema({
	email: email(),
	password: password(),
});

export default apiWithSession(async (req, res) => {
	if (!requestData.validate(req, res)) {
		return;
	}

	const data = req.body;

	if (await prisma.user.findUnique({ where: { email: data.email } })) {
		return res
			.status(400)
			.json({ errors: [{ message: "Email must be unique" }] });
	}

	const newUser = await prisma.user.create({
		data: {
			email: data.email,
			password: await hashPassword(data.password),
		},
	});

	// login in the user once his account is created
	req.session.user = {
		id: newUser.id,
	};

	await req.session.save();

	return res.status(200).json({});
});
