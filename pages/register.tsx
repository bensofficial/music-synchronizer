import {
	Button,
	Center,
	Heading,
	Text,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { FormInput } from "$app/form";
import { useState } from "react";
import { password, string, email } from "$lib/validation/rules";

export default function Login() {
	const [passwordInput, setPasswordInput] = useState("");

	return (
		<Center h="100vh">
			<VStack
				spacing={6}
				minW={80}
				maxW={96}
				p={8}
				borderRadius="lg"
				bg={useColorModeValue("gray.50", "gray.700")}>
				<Heading size="lg" textAlign="center">
					Register
				</Heading>
				<Text
					color={useColorModeValue(
						"brand.errorLight",
						"brand.errorDark",
					)}
					textAlign="center">
					Server Error
				</Text>
				<FormInput
					type="email"
					name="email"
					rule={email()}
					label="Email"></FormInput>
				<FormInput
					type="password"
					name="password"
					onChange={(e) => {
						setPasswordInput(e.target.value);
					}}
					value={passwordInput}
					rule={password()}
					label="Password"></FormInput>
				<FormInput
					type="password"
					name="repeatPassword"
					rule={string().matchesString(
						passwordInput,
						"Must be the same password",
					)}
					label="Repeat Password"></FormInput>
				<Button w="100%">Submit</Button>
			</VStack>
		</Center>
	);
}
