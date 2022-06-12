import { apiRequireAuth } from "$lib/auth";
import { getUser } from "$lib/services/spotify/api/getUser";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const { error, errorMessage, responseData } = await getUser(
		sessionData.user,
	);

	if (error) {
		res.status(409).send(errorMessage);
		return;
	}

	res.status(200).send(responseData);
});
