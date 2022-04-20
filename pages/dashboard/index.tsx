import DashboardNav from "$app/layout/DashboardNav";
import Container from "$app/layout/Container";
import {
	Box,
	Center,
	Flex,
	Grid,
	Heading,
	HStack,
	Image,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Tag,
	Text,
	useColorModeValue,
	VStack,
	useDisclosure,
	Button,
	ModalHeader,
	Link,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function Index() {
	const lightTextColor = useColorModeValue("gray.300", "gray.600");

	const { isOpen, onOpen, onClose } = useDisclosure();

	const router = useRouter();

	return (
		<>
			<DashboardNav></DashboardNav>
			<Container py={5}>
				<Heading>Hallo, Simon Weckler 👋</Heading>
				<Text mb={16} fontWeight="thin" fontSize="xl">
					Deine Services:
				</Text>
				<HStack gap={5}>
					<HStack
						onClick={() => {
							router.push("/dashboard/spotify");
						}}
						gap={10}
						w="max-content"
						_hover={{
							boxShadow: useColorModeValue("2xl", "dark-lg"),
							cursor: "pointer",
						}}
						borderWidth="2px"
						borderRadius="lg"
						p={5}>
						<Image
							h={16}
							w={16}
							src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
							alt="spotify logo"></Image>
						<VStack align="end">
							<Tag fontWeight="bold">Service</Tag>
							<Heading>Spotify</Heading>
						</VStack>
					</HStack>
					<HStack
						gap={10}
						w="max-content"
						_hover={{
							boxShadow: useColorModeValue("2xl", "dark-lg"),
							cursor: "pointer",
						}}
						borderWidth="2px"
						borderRadius="lg"
						p={5}>
						<Image
							h={16}
							w={16}
							src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg"
							alt="spotify logo"></Image>
						<VStack align="end">
							<Tag fontWeight="bold">Service</Tag>
							<Heading>Youtube Music</Heading>
						</VStack>
					</HStack>
					<Center
						onClick={onOpen}
						w="max-content"
						_hover={{
							boxShadow: useColorModeValue("2xl", "dark-lg"),
							cursor: "pointer",
						}}
						p={5}
						borderWidth="2px"
						borderRadius="lg">
						<AddIcon color={lightTextColor} h={16} w={16}></AddIcon>
					</Center>
				</HStack>
			</Container>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Service</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack gap={3}>
							<Button variant="outline" w="full">
								<HStack h="full">
									<Image
										h={5}
										w={5}
										alt="Spotify"
										src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
									/>
									<Text>Spotify</Text>
								</HStack>
							</Button>
							<Button variant="outline" w="full">
								<HStack h="full">
									<Image
										h={5}
										w={5}
										alt="Spotify"
										src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg"
									/>
									<Text>Youtube Music</Text>
								</HStack>
							</Button>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
