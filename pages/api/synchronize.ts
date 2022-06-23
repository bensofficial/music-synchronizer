import { string } from "$lib/validation/rules";
import schema from "$lib/validation/Schema";

const requestData = schema({
	service: string().matchesRegex(
		/^spotify|youtube$/gm,
		"service must be spotify or youtube",
	),
	destinationId: string(),
});
