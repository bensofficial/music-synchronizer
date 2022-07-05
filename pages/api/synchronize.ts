import { apiRequireAuth } from "$lib/auth";
import { string } from "$lib/validation/rules";
import schema from "$lib/validation/Schema";
import prisma from "$lib/prisma";
import synchronizePlaylist from "$lib/services/synchronize";
import getService from "$lib/services";

const serviceRegex = /spotify|youtube/;

const requestData = schema({
	originService: string().matchesRegex(
		serviceRegex,
		"must be spotify or youtube",
	),
	destinationService: string().matchesRegex(
		serviceRegex,
		"must be spotify or youtube",
	),
	originPlaylistId: string(),
	destinationPlaylistId: string(),
});

export default apiRequireAuth(async (req, res, _session, sessionData) => {
	if (!requestData.validateRequestBody(req, res)) {
		return;
	}

	const user = await prisma.user.findUnique({
		where: { id: sessionData.user.id },
	});

	if (!user) {
		return res
			.status(500)
			.send({ errors: [{ message: "Unexpected error: No User found" }] });
	}

	const data = req.body;

	try {
		await synchronizePlaylist(
			user,
			data.originPlaylistId,
			data.destinationPlaylistId,
			getService(data.originService),
			getService(data.destinationService),
		);

		return res.status(200).send({});
	} catch (e) {
		if (e instanceof Error) {
			console.log(e);

			return res.status(500).send({ errors: [{ message: e.message }] });
		}
	}
});
