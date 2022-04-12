import {
	apiAuth,
	hashPassword,
	shouldRehashPassword,
	verifyPassword,
} from "$lib/auth";
import { email, string } from "$lib/validation/rules";
import schema from "$lib/validation/Schema";
import prisma from "$lib/prisma";

const requestData = schema({
	email: email(),
	password: string(),
});

export default apiAuth(async (req, res) => {
	if (!requestData.validate(req, res)) {
		return;
	}

	const data = req.body;

	const user = await prisma.user.findFirst({ where: { email: data.email } });

	// if no user with the given email exists, verify the password against
	// a hash to prevent timing attacks
	const hashToVerifyAgainst =
		user?.password ??
		"$argon2i$v=19$m=4096,t=3,p=1$UFp3ZFmnUdIc84t1M7zpXQ$o+I1FxwYr0ulRgG4epYb+EIWxI/g8lEiLXTv4Ps1W8k";

	const passwordIsValid = await verifyPassword(
		data.password,
		hashToVerifyAgainst,
	);

	if (passwordIsValid || !user) {
		return res.status(500).send({
			errors: [{ message: "Invalid username or password" }],
		});
	}

	//in case the algorithm changed or something similar, rehash the
	//password to ensure that the hash is up to date
	if (shouldRehashPassword(user.password)) {
		await prisma.user.update({
			data: {
				password: await hashPassword(data.password),
			},
			where: {
				id: user.id,
			},
		});
	}

	if (req.session.user) {
		return res
			.status(400)
			.send({ errors: [{ message: "Already logged in" }] });
	}

	req.session.user = {
		id: user.id,
	};

	await req.session.save();

	return res.status(200).json(user);
});
