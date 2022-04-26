import {
	Heading,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Text,
	VStack,
	useDisclosure,
	Button,
	ModalHeader,
	Flex,
	Icon,
	Center,
	useColorModeValue,
} from "@chakra-ui/react";
import { Page } from "$types/next";
import DashboardLayout from "$app/layout/DashboardLayout";
import ServiceCard from "$app/services/ServiceCard";
import SpotifyIcon from "$app/icons/SpotifyIcon";
import YoutubeMusicIcon from "$app/icons/YoutubeMusicIcon";
import AddServiceButton from "$app/services/AddServiceButton";
import ServiceCardWrapper from "$app/services/ServiceCardWrapper";
import { IoAdd } from "react-icons/io5";

const Index: Page = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Heading mb={4}>Hallo, Simon Weckler 👋</Heading>
			<Text mb={4} fontWeight="thin" fontSize="2xl">
				Deine Services:
			</Text>
			<Flex flexWrap="wrap">
				<ServiceCard
					flexBasis={{ base: "100%", md: "auto" }}
					href="/dashboard/spotify"
					mr={{ base: 0, md: 4 }}
					mb={4}
					serviceName="Spotify">
					<SpotifyIcon />
				</ServiceCard>
				<ServiceCard
					mr={{ base: 0, md: 4 }}
					mb={4}
					flexBasis={{ base: "100%", md: "auto" }}
					href="dashboard/youtube"
					serviceName="Youtube Music">
					<YoutubeMusicIcon />
				</ServiceCard>
				<ServiceCardWrapper
					mb={4}
					flexBasis={{ base: "100%", md: "auto" }}
					onClick={onOpen}>
					<Center h="full" px={6}>
						<Icon
							color={useColorModeValue("gray.200", "gray.600")}
							w={16}
							h={16}
							as={IoAdd}
						/>
					</Center>
				</ServiceCardWrapper>
			</Flex>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Service</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack gap={3}>
							<AddServiceButton serviceName="Spotify">
								<SpotifyIcon />
							</AddServiceButton>
							<AddServiceButton serviceName="Youtube Music">
								<YoutubeMusicIcon />
							</AddServiceButton>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
