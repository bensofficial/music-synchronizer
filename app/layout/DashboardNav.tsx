import { Button, Flex, Heading } from "@chakra-ui/react";

export default function DashboardNav() {
	return (
		<Flex
			alignItems="center"
			direction="row"
			py={5}
			justifyContent="space-between">
			<Heading size="lg">Music-Synchronizer</Heading>
			<Button colorScheme="red" variant="outline">
				Logout
			</Button>
		</Flex>
	);
}
