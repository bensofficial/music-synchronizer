import { Button, Center, Heading } from "@chakra-ui/react";
import * as queryString from "query-string";
import { SessionUser, ssrRequireAuth } from "$lib/auth";
import { InferGetServerSidePropsType } from "next";
import prisma from "$lib/prisma";
import { isUserLoggedInWithSpotify } from "$lib/services/spotify/auth";
import Link from "$/components/chakra/Link";
import { getUser } from "$lib/services/spotify/api/getUser";
import getEnvVar from "$lib/env";

export default function Spotify({
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<Center h="100vh">
			{error === null ? (
				<>
					<Heading>
						Authentication with Spotify was successful 👍
					</Heading>
					<Link href="/dashboard" textDecoration={"none"}>
						<Button>Return to Dashboard</Button>
					</Link>
				</>
			) : (
				<Heading>😔 {error}</Heading>
			)}
		</Center>
	);
}

export const getServerSideProps = ssrRequireAuth<{
	error: string | null;
}>(async (_ctx, _session, sessionData) => {
	if (await isUserConnected(sessionData.user)) {
		return {
			props: {
				error: "user_already_authenticated",
			},
		};
	}

	const clientId = getEnvVar("SPOTIFY_CLIENT_ID");
	const clientSecret = getEnvVar("SPOTIFY_CLIENT_SECRET");
	const baseUrl = getEnvVar("BASE_URL");

	const code = _ctx.query.code || null;
	const error = _ctx.query.error || null;
	const state = _ctx.query.state || null;

	const previousState = _ctx.req.cookies.spotify_state;

	if (error !== null) {
		return {
			props: {
				error: error.toString(),
			},
		};
	}

	if (state === null) {
		return {
			props: {
				error: "state_is_null",
			},
		};
	}

	if (state !== previousState) {
		return {
			props: {
				error: "state_mismatch",
			},
		};
	}

	const authOptions = {
		method: "POST",
		body: queryString.stringify({
			code: code,
			redirect_uri: `${baseUrl}/spotify/callback`,
			grant_type: "authorization_code",
		}),
		headers: {
			Authorization:
				"Basic " +
				new Buffer(clientId + ":" + clientSecret).toString("base64"),
			"Content-Type": "application/x-www-form-urlencoded",
		},
		json: true,
	};

	fetch("https://accounts.spotify.com/api/token", authOptions).then(
		async (response) => {
			await setSpotifyTokens(sessionData.user, response);
			await setSpotifyUserId(sessionData.user);
		},
	);

	return {
		props: {
			error: null,
		},
	};
});

async function isUserConnected(sessionUser: SessionUser): Promise<boolean> {
	const user = await prisma.user.findFirst({
		where: {
			id: sessionUser.id,
		},
	});

	return isUserLoggedInWithSpotify(user);
}

async function setSpotifyTokens(sessionUser: SessionUser, response: Response) {
	const data = await response.json();

	const accessToken = data.access_token;
	const refreshToken = data.refresh_token;

	await prisma.user.update({
		data: {
			spotifyAccessToken: accessToken,
			spotifyRefreshToken: refreshToken,
		},
		where: {
			id: sessionUser.id,
		},
	});
}

async function setSpotifyUserId(sessionUser: SessionUser) {
	const { error, errorMessage, responseData } = await getUser(sessionUser);

	console.log("reponse bei user request", responseData);

	await prisma.user.update({
		data: {
			spotifyUserId: responseData.id,
		},
		where: {
			id: sessionUser.id,
		},
	});
}
