import String from "./String";

export type { default as ValidationRule } from "./ValidationRule";

export function string() {
	return new String();
}

export function number() {
	return new Number();
}

export function password(): String {
	return string()
		.contains(/[0-9]/g, "number")
		.contains(/[A-Z]/g, "uppercase letter")
		.minLen(6)
		.maxLen(100);
}

export function email(): String {
	return string().matchesRegex(
		/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
		"Must be a valid email",
	);
}
