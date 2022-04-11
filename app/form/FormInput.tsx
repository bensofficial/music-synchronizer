import { Rule } from "$lib/validation";
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	InputProps,
} from "@chakra-ui/react";
import { useState } from "react";

export default function FormInput({
	rule,
	name,
	type,
	label,
	...props
}: InputProps & {
	rule: Rule;
	type: string;
	name: string;
	label: string;
}) {
	const [error, setError] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	return (
		<FormControl {...props} isRequired isInvalid={error}>
			<FormLabel htmlFor={name} fontWeight="semibold">
				{label}
			</FormLabel>
			<Input
				type={type}
				onChange={(e) => {
					const { error, errorMessage } = rule.validate(
						e.target.value,
					);

					setError(error);
					setErrMsg(errorMessage);
				}}
				id={name}></Input>
			{error && <FormErrorMessage>{errMsg}</FormErrorMessage>}
		</FormControl>
	);
}
