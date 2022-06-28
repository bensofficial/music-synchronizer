import { Button, Center, Heading, VStack } from "@chakra-ui/react";
import * as queryString from "query-string";
import { SessionUser, ssrRequireAuth } from "$lib/auth";
import { InferGetServerSidePropsType } from "next";
import prisma from "$lib/prisma";
import { isUserLoggedInWithSpotify } from "$lib/services/spotify/auth";
import Link from "$/components/chakra/Link";
import getEnvVar from "$lib/env";
import { getRequest, postRequest } from "$lib/serverRequest";
import { SpotifyUser } from "$lib/services/spotify/types";
import DisplayError from "$components/error/DisplayError";

export default function Spotify({
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<Center h="100vh">
			{!error ? (
				<>
					<Heading>
						Authentication with Spotify was successful 👍
					</Heading>
					<Link mt={4} href="/dashboard" textDecoration={"none"}>
						<Button>Return to Dashboard</Button>
					</Link>
				</>
			) : (
				<VStack>
					<DisplayError errorMessage={error} />
					<Link mt={4} href="/dashboard" textDecoration={"none"}>
						<Button>Return to Dashboard</Button>
					</Link>
				</VStack>
			)}
		</Center>
	);
}

//TODO: das muss irgendwie zum dashboard verschoben werden
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

	const {
		resData,
		error: resError,
		errorMessage,
	} = await postRequest<{
		access_token: string;
		refresh_token: string;
	}>("https://accounts.spotify.com/api/token", {
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
	});

	if (resError || !resData) {
		return {
			props: {
				error: errorMessage,
			},
		};
	}

	const {
		resData: spotifyUser,
		error: spotifyUserError,
		errorMessage: spotifyUserErrorMessage,
		status,
	} = await getRequest<SpotifyUser>("https://api.spotify.com/v1/me", {
		headers: {
			Authorization: `Bearer ${resData.access_token}`,
			"Content-Type": "application/json",
		},
		body: null,
	});

	if (!spotifyUser || spotifyUserError) {
		return {
			props: {
				error: spotifyUserErrorMessage,
			},
		};
	}

	await setSpotifyUserId(sessionData.user, spotifyUser);
	await setSpotifyTokens(sessionData.user, resData);

	return {
		props: {
			error: null,
		},
	};
});

async function setSpotifyTokens(
	sessionUser: SessionUser,
	resData: { refresh_token: string; access_token: string },
) {
	await prisma.user.update({
		data: {
			spotifyAccessToken: resData.access_token,
			spotifyRefreshToken: resData.refresh_token,
		},
		where: {
			id: sessionUser.id,
		},
	});
}

async function setSpotifyUserId(
	sessionUser: SessionUser,
	spotifyUser: SpotifyUser,
) {
	await prisma.user.update({
		data: {
			spotifyUserId: spotifyUser.id,
		},
		where: {
			id: sessionUser.id,
		},
	});
}

async function isUserConnected(sessionUser: SessionUser): Promise<boolean> {
	const user = await prisma.user.findFirst({
		where: {
			id: sessionUser.id,
		},
	});

	return isUserLoggedInWithSpotify(user);
}

