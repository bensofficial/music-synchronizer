import {
	Button,
	Flex,
	Heading,
	Link,
	useColorModeValue,
} from "@chakra-ui/react";

export default function DashboardNav() {
	return (
		<Flex
			px="15%"
			alignItems="center"
			direction="row"
			py={5}
			borderBottomWidth="2px"
			justifyContent="space-between">
			<Heading size="lg">Music-Synchronizer</Heading>
			<Button colorScheme="red" variant="outline">
				Logout
			</Button>
		</Flex>
	);
}
