import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";
import {
	getAllPlaylists,
	getPlaylistBatch,
} from "$lib/services/youtube/api/getPlaylists";
import { number, string } from "$lib/validation/rules";
import schema from "$lib/validation/Schema";

const requestData = schema({
	pageToken: string().nullable(),
	maxResults: number().integer().greaterThan(0).lessThan(51),
});

export default apiRequireAuth(async (req, res, _session, sessionData) => {
	if (!requestData.validateRequestQuery(req, res)) {
		return;
	}

	const user = await prisma.user.findUnique({
		where: { id: sessionData.user.id },
	});

	if (!user) {
		return res.status(400).json({ errors: [{ message: "No User found" }] });
	}

	const result = await getPlaylistBatch(
		user,
		parseInt(req.query.maxResults as string),
		req.query.pageToken ? (req.query.pageToken as string) : null,
	);

	if (result instanceof Error) {
		return res.status(500).json({ errors: [{ message: result.message }] });
	}

	return res.status(200).send(result);
});
