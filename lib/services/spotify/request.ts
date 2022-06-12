import { User } from "@prisma/client";
import { requestNewAccessToken } from "./requestNewAccessToken";

type RequestMethod = "POST" | "GET";

export async function getRequest(uri: string, user: User) {
	const { error, errorMessage, responseData, statusCode } = await request(
		uri,
		user.spotifyAccessToken,
		"GET",
		null,
	);

	if (error && statusCode == 401) {
		const { accessToken } = await requestNewAccessToken(user);

		if (!accessToken) {
			throw new Error(
				"Unexpected Error occurred, Received 401 but accessToken is still valid",
			);
		}

		return await request(uri, accessToken, "GET", null);
	}

	return { error, errorMessage, responseData };
}

async function request(
	uri: string,
	accessToken: string,
	method: RequestMethod,
	body: Record<string, any> | null,
) {
	const options = {
		headers: {
			Authorization: "Bearer " + accessToken,
			"Content-Type": "application/json",
		},
		method,
		body: body ? JSON.stringify(body) : null,
	};

	let error: boolean;
	let errorMessage = "";
	let responseData = null;
	let statusCode: number;

	const res: Response = await fetch(uri, options);

	error = !res.ok;

	responseData = await res.json();
	statusCode = res.status;

	if (error) {
		try {
			errorMessage = responseData.error.message;
		} catch (e) {}
	}

	return { error, errorMessage, responseData, statusCode };
}
