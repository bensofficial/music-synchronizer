import { RequestInit } from "next/dist/server/web/spec-extension/request";

export type RequestMethod = "POST" | "GET" | "DELETE";

export async function getRequest<T = Record<string, never>>(
	uri: string,
	options: RequestInit,
) {
	return await serverRequest<T>(uri, "GET", options);
}

export async function postRequest<T = Record<string, never>>(
	uri: string,
	options: RequestInit,
) {
	return await serverRequest<T>(uri, "POST", options);
}

export async function deleteRequest<T = Record<string, never>>(
	uri: string,
	options: RequestInit,
) {
	return await serverRequest<T>(uri, "DELETE", options);
}

export async function serverRequest<T>(
	uri: string,
	method: RequestMethod,
	options: RequestInit,
) {
	let error: boolean;
	let errorMessage = "";
	let resData: T | null = null;
	let status: number;

	options.method = method;

	const res: Response = await fetch(uri, options);

	error = !res.ok;
	status = res.status;

	let resBody = null;

	// if this fails it means that the body is not in json format
	try {
		resBody = await res.clone().json();
	} catch (e) {
		const text = await res.text();
		errorMessage = text;

		return { error, errorMessage, resData, status };
	}

	if (error) {
		try {
			errorMessage = resBody.error.message;
		} catch (e) {}
	} else {
		resData = resBody;
	}

	return { error, errorMessage, resData, status };
}
