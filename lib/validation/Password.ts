import string, { String } from "./String";

export default function password(): String {
	return string()
		.contains(/[0-9]/g, "number")
		.contains(/[A-Z]/g, "uppercase letter")
		.minLen(6)
		.maxLen(100);
}
