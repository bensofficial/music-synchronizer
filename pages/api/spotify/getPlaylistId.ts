import { apiRequireAuth } from "$lib/auth";
import getPlaylistId from "$lib/services/spotify/api/getPlaylistId";
import { string } from "$lib/validation/rules";
import schema from "$lib/validation/Schema";

const requestData = schema({
	title: string(),
});

export default apiRequireAuth(async (req, res, _session, sessionData) => {
	if (!requestData.validateRequestQuery(req, res)) {
		return;
	}

	const title = req.query.title;

	if (title instanceof Array) {
		return res.status(400).json({
			errors: [
				{
					message: "Query parameter title must be a single string",
				},
			],
		});
	}

	const user = await prisma?.user.findUnique({
		where: { id: sessionData.user.id },
	});

	if (!user) {
		return res.status(400).json({ errors: [{ message: "No User found" }] });
	}

	try {
		const playlistId = await getPlaylistId(user, title);

		if (playlistId === null) {
			return res.status(404).send({});
		}

		return res.status(200).send({ playlistId });
	} catch (e) {
		if (e instanceof Error) {
			return res.status(500).send({ errors: [{ message: e.message }] });
		}
	}
});
