import { usePostRequest } from "$lib/clientRequest";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function DashboardNav() {
	const { loading, error, send, data } = usePostRequest("/api/auth/logout");
	const router = useRouter();

	if (!loading && !error && data) {
		router.push("/login");
	}

	return (
		<Flex
			alignItems="center"
			direction="row"
			py={5}
			justifyContent="space-between">
			<Heading size="lg">Music-Synchronizer</Heading>
			<Button
				onClick={() => {
					send();
				}}
				colorScheme="red"
				variant="outline">
				Logout
			</Button>
		</Flex>
	);
}
