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

export default function Login() {
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
					textAlign="center"></Text>
				<FormInput
					type="email"
					name="email"
					rule={email()}
					label="Email"></FormInput>
				<FormInput
					type="password"
					name="password"
					rule={string()}
					label="Password"></FormInput>
				<Button w="100%">Submit</Button>
			</VStack>
		</Center>
	);
}
