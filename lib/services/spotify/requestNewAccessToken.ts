import prisma from "$lib/prisma";
import * as queryString from "query-string";
import { isUserLoggedInWithSpotify } from "$lib/services/spotify/auth";
import { User } from "@prisma/client";
import getEnvVar from "$lib/env";

export async function requestNewAccessToken(
	user: User,
): Promise<{ accessToken: string | null | undefined; error: any }> {
	const clientId = getEnvVar("SPOTIFY_CLIENT_ID");
	const clientSecret = getEnvVar("SPOTIFY_CLIENT_SECRET");
	const refreshToken = user.spotifyRefreshToken;

	if (
		!isUserLoggedInWithSpotify({
			spotifyRefreshToken: user.spotifyRefreshToken,
		})
	) {
		return {
			accessToken: null,
			error: "user_is_not_authenticated",
		};
	}

	const authOptions: RequestInit = {
		method: "POST",
		body: queryString.stringify({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		}),
		headers: {
			Authorization:
				"Basic " +
				Buffer.from(clientId + ":" + clientSecret).toString("base64"),
			"Content-Type": "application/x-www-form-urlencoded",
		},
	};

	const response = await fetch(
		"https://accounts.spotify.com/api/token",
		authOptions,
	);

	if (response.status == 400) {
		return {
			accessToken: null,
			error: "token_still_valid",
		};
	}

	const data = await response.json();
	const accessToken = data.access_token;

	await setNewToken(accessToken, user);

	return {
		accessToken,
		error: null,
	};
}

async function setNewToken(accessToken: string, user: User) {
	await prisma.user.update({
		data: {
			spotifyAccessToken: accessToken,
		},
		where: {
			id: user.id,
		},
	});
}
