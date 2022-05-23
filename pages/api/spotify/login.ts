import generateRandomString from "../../../lib/generateRandomString";
import { apiRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";
import { isUserLoggedInWithSpotify } from "$lib/services/spotify/auth";
import serializeCookie from "$lib/cookie";
import getEnvVar from "$lib/env";

const clientId = getEnvVar("SPOTIFY_CLIENT_ID");
const baseUrl = getEnvVar("BASE_URL");

const state = generateRandomString(16);
const scope =
	"playlist-modify-public playlist-read-private playlist-modify-private";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {
	const user = await prisma.user.findFirst({
		where: {
			id: sessionData.user.id,
		},
	});

	if (!clientId || !baseUrl) {
		return res.status(500).send({
			errors: [
				{
					message:
						"Unable to login. Environment variables are not set",
				},
			],
		});
	}

	if (isUserLoggedInWithSpotify(user)) {
		res.redirect(
			307,
			`http://localhost:3000/spotify/callback?error=user_already_authenticated`,
		);
		return;
	}

	res.setHeader(
		"Set-Cookie",
		serializeCookie("spotify_state", state, {
			httpOnly: true,
			secure: true,
			maxAge: 60 * 60,
			sameSite: "Lax",
			path: "/",
		}),
	);

	try {
		res.redirect(
			307,
			"https://accounts.spotify.com/authorize?" +
				new URLSearchParams(
					`response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${baseUrl}/spotify/callback&state=${state}`,
				),
		);
	} catch (err) {
		res.status(500).send({ error: "failed to fetch data" });
	}
});
