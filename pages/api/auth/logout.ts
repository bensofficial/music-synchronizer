import { apiRequireAuth } from "$lib/auth";

export default apiRequireAuth((req, res, _sessionUser) => {
	req.session.destroy();

	res.status(200).json({});
	return;
});
