export interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: "Strict" | "Lax" | "None";
	maxAge?: number;
	path?: string;
	domain?: string;
	expires?: Date;
}

function defaultValue<T>(value: T | undefined, defaultValue: T): T {
	if (!value) {
		return defaultValue;
	}
	return value;
}

export default function serializeCookie(
	name: string,
	value: string,
	options: CookieOptions,
) {
	const httpOnly = defaultValue(options.httpOnly, false);
	const secure = defaultValue(options.secure, true);
	const sameSite = defaultValue(options.sameSite, "None");
	const maxAge = defaultValue(options.maxAge, 60 * 60);
	const path = defaultValue(options.path, "/");

	return `${name}=${value};
        HttpOnly=${httpOnly};
        Secure=${secure};
        SameSite=${sameSite};
        Max-Age=${maxAge};
        Path=${path}
        ${options.domain ? `;Domain=${options.domain}` : ""}
        ${options.expires ? `;Expires=${options.expires}` : ""}`.replace(
		/\r?\n|\r/g,
		"",
	);
}
