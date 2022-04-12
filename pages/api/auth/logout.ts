import { apiRequireAuth } from "$lib/auth";

export default apiRequireAuth((req, res, _sessionUser) => {
	req.session.destroy();

	return res.status(200).send("Successfully logged out");
});
