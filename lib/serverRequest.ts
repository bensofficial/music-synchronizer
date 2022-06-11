import { requestNewAccessToken } from "$lib/services/spotify/requestNewAccessToken";
import { SessionUser } from "$lib/auth";
import {User} from "@prisma/client";

export async function getRequest(
	givenAccessToken: string,
	uri: string,
	authOptions: RequestInit = {},
	user: User,
) {
	const { error, errorMessage, responseData, statusCode } = await request(
		givenAccessToken,
		uri,
		authOptions,
	);

	console.log("error in serverRequest method", error);
	console.log("statusCode in serverRequest", statusCode);
	console.log("response in serverRequest", responseData);

	if (error && statusCode == 401) {
		console.log("401 error");
		const { accessToken, error } = await requestNewAccessToken(user);
		return await request(accessToken!, uri, authOptions);
	}

	return { error, errorMessage, responseData };
}

async function request(
	accessToken: string,
	uri: string,
	authOptions: RequestInit,
) {
	authOptions.headers = {
		Authorization: "Bearer " + accessToken,
		"Content-Type": "application/json",
	};

	let error: boolean;
	let errorMessage = "";
	let responseData = null;
	let statusCode: number;

	const res: Response = await fetch(uri, authOptions);

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
