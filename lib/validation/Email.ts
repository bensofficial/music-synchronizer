import Rule from "./Rule";
import string, { String } from "./String";

export default function email(): String {
	return string().matchesRegex(
		/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
		"Must be a valid email",
	);
}
