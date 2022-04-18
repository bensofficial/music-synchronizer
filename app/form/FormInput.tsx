import { ValidationRule } from "$lib/validation/rules";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputProps,
	InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";

export default function FormInput({
	rule,
	name,
	type,
	label,
	...props
}: InputProps & {
	rule: ValidationRule;
	type: string;
	name: string;
	label: string;
}) {
	const [error, setError] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [viewPassword, setViewPassword] = useState(false);

	return (
		<FormControl {...props} isRequired isInvalid={error}>
			<FormLabel htmlFor={name} fontWeight="semibold">
				{label}
			</FormLabel>
			<InputGroup>
				<Input
					type={!viewPassword ? type : "text"}
					onChange={(e) => {
						const { error, errorMessage } = rule.validate(
							e.target.value,
						);

						setError(error);
						setErrMsg(errorMessage);
					}}
					id={name}></Input>
				{type === "password" && (
					<InputRightElement>
						<IconButton
							variant="ghost"
							onClick={() => {
								setViewPassword(!viewPassword);
							}}
							aria-label={
								viewPassword ? "Hide password" : "Show password"
							}
							icon={
								viewPassword ? <ViewOffIcon /> : <ViewIcon />
							}></IconButton>
					</InputRightElement>
				)}
			</InputGroup>
			{error && <FormErrorMessage>{errMsg}</FormErrorMessage>}
		</FormControl>
	);
}
