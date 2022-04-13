import { NextApiRequest, NextApiResponse } from "next";
import { ValidationRule } from "./rules";

interface schemaShape {
	[index: string]: ValidationRule;
}

class Schema {
	private schemaShape: schemaShape;

	constructor(schemaShape: schemaShape) {
		this.schemaShape = schemaShape;
	}

	validate(req: NextApiRequest, res: NextApiResponse): boolean {
		const requestData = req.body;

		if (!requestData || typeof requestData !== "object") {
			res.status(400).send({
				errors: [
					{
						message: `Request body must be an object`,
					},
				],
			});
		}

		for (const [key, validationRule] of Object.entries(this.schemaShape)) {
			if (!(key in requestData)) {
				res.status(400).send({
					errors: [
						{
							message: `Request body must contain a ${key} field`,
						},
					],
				});
				return false;
			}

			const { error, errorMessage } = validationRule.validate(
				requestData[key],
			);

			if (error) {
				res.status(400).send({
					error: [
						{
							message: `Field ${key} : ${errorMessage}`,
						},
					],
				});
				return false;
			}
		}

		return true;
	}
}

/**
 * A Schema can be used to can be used in `api routes` to verify that the data
 * in the request body is valid.

 * The function expects an object consisting of validationRules (see example)
 *
 * A schema can be defined in the following way:
 *
 * ```
 * import {email, string} from "$lib/validation/rules"
 *
 * const expectedData = schema({
 * 		email: email(),
 * 		username: string().minLen(5)
 * })
 * ```
 * You can validate the data in the api route like this: (Logically you should do this before you use the data)
 * ```
 * export default someApiRoute((req, res) => {
 * 		if(!expectedData.validate(req, res)){
 * 			return;		
 * 		}
 * 		//do other stuff
 * })
 * ```
 */
export default function schema(schemaShape: schemaShape) {
	return new Schema(schemaShape);
}
