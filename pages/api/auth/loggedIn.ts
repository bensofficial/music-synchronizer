import { apiWithSession } from "$lib/auth";

export default apiWithSession(async (_req, res, session) => {
	return res.status(200).json({ isLoggedIn: session.data !== null });
});
