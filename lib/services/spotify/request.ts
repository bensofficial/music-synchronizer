import { RequestMethod, serverRequest } from "$lib/request/serverRequest";
import { User } from "@prisma/client";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { isUserLoggedInWithSpotify } from "./auth";
import { requestNewAccessToken } from "./requestNewAccessToken";

export async function getRequest<T = Record<string, never>>(
	uri: string,
	user: User,
) {
	return await requestRefreshTokenWrapper<T>(uri, user, "GET", null);
}

export async function postRequest<T = Record<string, never>>(
	uri: string,
	user: User,
	body: Record<string, any> | null | string,
) {
	return await requestRefreshTokenWrapper<T>(uri, user, "POST", body);
}

export async function deleteRequest<T = Record<string, never>>(
	uri: string,
	user: User,
	body: Record<string, any> | null | string,
) {
	return await requestRefreshTokenWrapper<T>(uri, user, "DELETE", body);
}

async function requestRefreshTokenWrapper<T>(
	uri: string,
	user: User,
	method: RequestMethod,
	body: Record<string, any> | null | string = null,
) {
	if (!isUserLoggedInWithSpotify(user)) {
		throw new Error("This user is not logged in with spotify");
	}

	if (typeof body === "object" && body !== null) {
		body = JSON.stringify(body);
	}

	const options: RequestInit = {
		headers: {
			Authorization: `Bearer ${user.spotifyAccessToken}`,
			"Content-Type": "application/json",
		},
		body: body,
	};

	const { error, errorMessage, resData, status } = await serverRequest<T>(
		uri,
		method,
		options,
	);

	if (error && status === 401) {
		const { accessToken } = await requestNewAccessToken(user);

		if (!accessToken) {
			throw new Error(
				"Unexpected Error occurred, received 401 but accessToken is still valid",
			);
		}

		options.headers = {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		};

		return await serverRequest<T>(uri, method, options);
	}

	return { error, errorMessage, resData, status };
}
