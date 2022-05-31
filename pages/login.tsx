import {
	Button,
	Center,
	Heading,
	Text,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { FormInput } from "$/components/form";
import { email, string } from "$lib/validation/rules";
import { usePostRequest } from "$lib/clientRequest";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "$components/chakra/Link";

export default function Login() {
	const { loading, errorMessage, error, send, data } =
		usePostRequest<Record<string, never>>("/api/auth/login");

	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");

	const router = useRouter();

	if (data && !error) {
		router.push("/dashboard");
	}

	return (
		<Center h="100vh">
			<VStack
				maxW={80}
				p={8}
				spacing={6}
				borderRadius="lg"
				bg={useColorModeValue("gray.100", "gray.700")}>
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
				<Text textAlign="center" fontWeight="semibold">
					Don&apos;t have an account yet?{" "}
					<Link color="brand.400" href="/register">
						Register
					</Link>
				</Text>
			</VStack>
		</Center>
	);
}
