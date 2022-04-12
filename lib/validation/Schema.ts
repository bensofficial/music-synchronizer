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

export default function schema(schemaShape: schemaShape) {
	return new Schema(schemaShape);
}
