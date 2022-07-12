import { PropsWithChildren } from "react";
import Container from "./Container";
import { usePostRequest } from "$lib/request/clientRequest";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Nav from "./Nav";

export default function DashboardLayout({
	children,
}: PropsWithChildren<Record<string, never>>) {
	const { loading, error, send, data } = usePostRequest("/api/auth/logout");
	const router = useRouter();

	if (!loading && !error && data) {
		router.push("/");
	}

	return (
		<>
			<Container mb={4} borderBottomWidth="2px">
				<Nav>
					<Button
						onClick={() => {
							send();
						}}
						colorScheme="red"
						variant="outline">
						Logout
					</Button>
				</Nav>
			</Container>
			<Container>{children}</Container>
		</>
	);
}
