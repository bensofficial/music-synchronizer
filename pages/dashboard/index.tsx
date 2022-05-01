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
import ServiceCardWrapper from "$app/services/ServiceCardWrapper";
import { IoAdd } from "react-icons/io5";
import { userIsConnectedToSpotify } from "$lib/spotify/auth";
import { ssrRequireAuth } from "$lib/auth";
import prisma from "$lib/prisma";
import { InferGetServerSidePropsType } from "next";
import { UserWithoutDatesAndPassword } from "$types/user";
import ConnectSpotifyButton from "$app/buttons/ConnectSpotifyButton";
import { useUserIsConnectedToYoutube } from "$lib/youtube/auth";
import YoutubeMusicIcon from "$app/icons/YoutubeMusicIcon";
import ConnectYoutubeButton from "$app/buttons/ConnectYoutubeButton";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Index: Page<Props> = ({ user }: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const addIconColor = useColorModeValue("gray.200", "gray.600");
	const userIsConnectedToYoutube = useUserIsConnectedToYoutube();

	return (
		<>
			<Heading mb={4}>
				Hi, {user.firstName} {user.lastName}
			</Heading>
			<Text mb={4} fontWeight="thin" fontSize="2xl">
				Your Services:
			</Text>
			<Flex flexWrap="wrap" minH={32}>
				{userIsConnectedToSpotify(user) && (
					<ServiceCard
						flexBasis={{ base: "100%", md: "auto" }}
						href="/dashboard/spotify"
						mr={{ base: 0, md: 4 }}
						mb={4}
						serviceName="Spotify">
						<SpotifyIcon />
					</ServiceCard>
				)}
				{userIsConnectedToYoutube && (
					<ServiceCard
						flexBasis={{ base: "100%", md: "auto" }}
						href="/dashboard/youtube"
						mr={{ base: 0, md: 4 }}
						mb={4}
						serviceName="Youtube Music">
						<YoutubeMusicIcon />
					</ServiceCard>
				)}
				<ServiceCardWrapper
					mb={4}
					flexBasis={{ base: "100%", md: "auto" }}
					onClick={onOpen}>
					<Center h="full" px={6}>
						<Icon color={addIconColor} w={16} h={16} as={IoAdd} />
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
							{!userIsConnectedToSpotify(user) && (
								<ConnectSpotifyButton />
							)}
							{!userIsConnectedToYoutube && (
								<ConnectYoutubeButton />
							)}
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

export const getServerSideProps = ssrRequireAuth<{
	user: UserWithoutDatesAndPassword;
}>(async (_context, _session, sessionData) => {
	const user = await prisma.user.findUnique({
		where: {
			id: sessionData.user.id,
		},
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			spotifyAccessToken: true,
			spotifyRefreshToken: true,
		},
	});

	if (!user) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: {
			user,
		},
	};
});

export default Index;
