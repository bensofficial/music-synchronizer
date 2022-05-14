import getEnvVar from "$lib/env";
import { User } from "@prisma/client";
import { google } from "googleapis";
import prisma from "lib/prisma";
import { userIsLoggedInWithGoogle } from "./authFrontend";

const GOOGLE_CLIENT_ID = getEnvVar("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = getEnvVar("GOOGLE_CLIENT_SECRET");
const GOOGLE_REDIRECT_URL = `${getEnvVar("BASE_URL")}/callback/youtube`;

const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URL,
);

google.options({ auth: oauth2Client });

const scopes = [
	"https://www.googleapis.com/auth/youtube",
	"https://www.googleapis.com/auth/youtube.force-ssl",
	"https://www.googleapis.com/auth/youtube.readonly",
];

export function generateAuthUrl() {
	return oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes,
	});
}

export async function handleCallback(
	authorizationCode: string,
	userId: number,
) {
	const { tokens } = await oauth2Client.getToken(authorizationCode);

	await prisma.user.update({
		where: { id: userId },
		data: {
			youtubeAccessToken: tokens.access_token ? tokens.access_token : "",
			youtubeRefreshToken: tokens.refresh_token
				? tokens.refresh_token
				: "",
		},
	});

	oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });
}

export function authorizeUser(user: User): void | Error {
	if (!userIsLoggedInWithGoogle(user)) {
		return new Error("User is not logged in with google");
	}

	oauth2Client.setCredentials({ refresh_token: user.youtubeRefreshToken });
}
