import { useEffect, useState } from "react";

type RequestMethod = "POST" | "GET";

export function usePostRequest<T>(url: string) {
	return useRequest<T>(url, "POST");
}

export function useGetRequest<T>(url: string) {
	const { send, ...values } = useRequest<T>(url, "GET");

	useEffect(() => {
		send();
	}, []);

	return { ...values };
}

function useRequest<T>(url: string, method: RequestMethod) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [data, setData] = useState<T | null>(null);

	function send(body: Record<string, any> | null = null) {
		setLoading(true);

		fetch(url, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			method: method,
			body: body ? JSON.stringify(body) : null,
		})
			.then((res) => {
				setError(!res.ok);
				return res.json();
			})
			.then((data) => {
				if (error) {
					try {
						setErrorMessage(data.errors[0].message);
					} catch (e) {}
				}

				setData(data);
				setLoading(false);
			});
	}

	return { loading, error, errorMessage, data, send };
}
