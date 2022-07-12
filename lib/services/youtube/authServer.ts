import getEnvVar from "$lib/env";
import { User } from "@prisma/client";
import { google } from "googleapis";
import prisma from "lib/prisma";
import { isUserLoggedInWithGoogle } from "./authFrontend";

const GOOGLE_CLIENT_ID = getEnvVar("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = getEnvVar("GOOGLE_CLIENT_SECRET");
const GOOGLE_REDIRECT_URL = `${getEnvVar("BASE_URL")}/dashboard?toast=youtube`;

const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URL,
);

google.options({ auth: oauth2Client });

const scopes = ["https://www.googleapis.com/auth/youtube.readonly"];

export function generateAuthUrl() {
	return oauth2Client.generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		scope: scopes,
	});
}

export async function handleCallback(
	authorizationCode: string,
	userId: number,
): Promise<void> {
	const { tokens } = await oauth2Client.getToken(authorizationCode);

	await prisma.user.update({
		where: { id: userId },
		data: {
			youtubeRefreshToken: tokens.refresh_token,
		},
	});

	oauth2Client.credentials = { refresh_token: tokens.refresh_token };
}

export function authorizeUser(user: User): void {
	if (!isUserLoggedInWithGoogle(user)) {
		throw new Error("User is not logged in with google");
	}

	oauth2Client.credentials = { refresh_token: user.youtubeRefreshToken };

	google.options({ auth: oauth2Client });
}
