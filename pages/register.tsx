import {
	Button,
	Center,
	Heading,
	Text,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { FormInput } from "$/components/form";
import { useState } from "react";
import { password, string, email } from "$lib/validation/rules";
import { usePostRequest } from "$lib/clientRequest";
import { useRouter } from "next/router";

export default function Login() {
	const [passwordInput, setPasswordInput] = useState("");
	const [emailInput, setEmailInput] = useState("");
	const [usernameInput, setUsernameInput] = useState("");

	const { loading, error, errorMessage, data, send } =
		usePostRequest<Record<string, never>>("/api/auth/register");

	const router = useRouter();

	if (!error && data) {
		router.push("/dashboard");
	}

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
					{errorMessage}
				</Text>
				<FormInput
					type="email"
					value={emailInput}
					onChange={(e) => {
						setEmailInput(e.target.value);
					}}
					name="email"
					rule={email()}
					label="Email"
				/>
				<FormInput
					type="text"
					value={usernameInput}
					name="username"
					label="Username"
					rule={string().minLen(1)}
					onChange={(e) => {
						setUsernameInput(e.target.value);
					}}
				/>
				<FormInput
					type="password"
					name="password"
					onChange={(e) => {
						setPasswordInput(e.target.value);
					}}
					value={passwordInput}
					rule={password()}
					label="Password"
				/>
				<FormInput
					type="password"
					name="repeatPassword"
					rule={string().matchesString(
						passwordInput,
						"Must be the same password",
					)}
					label="Repeat Password"
				/>
				<Button
					onClick={() => {
						send({
							email: emailInput,
							password: passwordInput,
							username: usernameInput,
						});
					}}
					isLoading={loading}
					w="100%">
					Submit
				</Button>
			</VStack>
		</Center>
	);
}
