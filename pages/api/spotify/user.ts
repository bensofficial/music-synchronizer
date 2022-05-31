import { apiRequireAuth } from "$lib/auth";
import { getRequest } from "$lib/serverRequest";
import { getUser } from "$lib/services/spotify/api/getUser";

export default apiRequireAuth(async (_req, _res, _session, sessionData) => {
	const { error, errorMessage, responseData } = await getUser(
		sessionData.user,
	);

	if (error) {
		_res.status(409).send(errorMessage);
		return;
	}

	_res.status(200).send(responseData);
});
