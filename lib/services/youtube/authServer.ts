import getEnvVar from "$lib/env";
import { google } from "googleapis";
import prisma from "lib/prisma";

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

	oauth2Client.credentials = tokens;
}
