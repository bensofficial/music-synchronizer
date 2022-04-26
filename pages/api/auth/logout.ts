import { apiRequireAuth } from "$lib/auth";

export default apiRequireAuth((_req, res, session, _sessionUser) => {
	session.destroy();

	res.status(200).json({});
	return;
});
