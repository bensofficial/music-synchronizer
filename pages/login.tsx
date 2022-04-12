import {
	Button,
	Center,
	Heading,
	Text,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { FormInput } from "$app/form";
import { email, string } from "$lib/validation/rules";
import { usePostRequest } from "$lib/clientRequest";
import { User } from "@prisma/client";
import { useState } from "react";

export default function Login() {
	const { loading, errorMessage, send } =
		usePostRequest<User>("/api/auth/login");

	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");

	return (
		<Center h="100vh">
			<VStack
				maxW={80}
				p={8}
				spacing={6}
				borderRadius="lg"
				bg={useColorModeValue("gray.50", "gray.700")}>
				<Heading size="lg" textAlign="center">
					Login
				</Heading>
				<Text
					color={useColorModeValue(
						"brand.errorLight",
						"brand.errorDark",
					)}
					textAlign="center">
					{errorMessage}
				</Text>
				<FormInput
					type="email"
					name="email"
					value={emailInput}
					onChange={(e) => {
						setEmailInput(e.target.value);
					}}
					rule={email()}
					label="Email"></FormInput>
				<FormInput
					type="password"
					name="password"
					value={passwordInput}
					onChange={(e) => {
						setPasswordInput(e.target.value);
					}}
					rule={string()}
					label="Password"></FormInput>
				<Button
					isLoading={loading}
					onClick={() => {
						send({
							email: emailInput,
							password: passwordInput,
						});
					}}
					w="100%">
					Submit
				</Button>
			</VStack>
		</Center>
	);
}
