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
import DashboardLayout from "$/components/layout/DashboardLayout";
import ServiceCard from "$/components/services/ServiceCard";
import SpotifyIcon from "$components/services/icons/SpotifyIcon";
import ServiceCardWrapper from "$/components/services/ServiceCardWrapper";
import { IoAdd } from "react-icons/io5";
import { isUserLoggedInWithSpotify } from "$lib/services/spotify/auth";
import { SessionUser, ssrRequireAuth } from "$lib/auth";
import { InferGetServerSidePropsType } from "next";
import { UserWithoutDatesAndPassword } from "$types/user";
import ConnectSpotifyButton from "$components/services/buttons/ConnectSpotifyButton";
import {
	generateAuthUrl,
	handleCallback,
} from "$lib/services/youtube/authServer";
import { isUserLoggedInWithGoogle } from "$lib/services/youtube/authFrontend";
import YoutubeMusicIcon from "$components/services/icons/YoutubeMusicIcon";
import ConnectYoutubeButton from "$components/services/buttons/ConnectYoutubeButton";
import { getUserWithoutDatesAndPassword } from "$lib/db/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import getEnvVar from "$lib/env";
import * as queryString from "query-string";
import { SpotifyUser } from "$lib/services/spotify/types";
import prisma from "$lib/prisma";
import { getRequest, postRequest } from "$lib/request/serverRequest";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Index: Page<Props> = ({ user, googleAuthUrl, error }: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const addIconColor = useColorModeValue("gray.200", "gray.600");
	const router = useRouter();
	const toast = useToast();

	const isLoggedInWithSpotify = isUserLoggedInWithSpotify(user);
	const isLoggedInWithGoogle = isUserLoggedInWithGoogle(user);

	useEffect(() => {
		const param = router.query["toast"];
		if (param == "spotify") {
			if (error !== null) {
				toast({
					title: `Es gab ein Problem (${error})`,
					status: "error",
					isClosable: true,
				});
				return;
			}
			toast({
				title: "Your account has successfully been connected with Spotify 👍",
				status: "success",
				isClosable: true,
			});
		}

		if (param == "youtube") {
			toast({
				title: "Your account has been connected with YouTube Music 👍",
				status: "success",
				isClosable: true,
			});
		}

		router.replace(`${window.location.origin}/dashboard`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoggedInWithGoogle, isLoggedInWithSpotify, error, toast]);

	return (
		<>
			<Heading mb={4}>Hi, {user.username}</Heading>
			<Text mb={4} fontWeight="thin" fontSize="2xl">
				Your Services:
			</Text>
			<Flex flexWrap="wrap" minH={32}>
				{isLoggedInWithSpotify && (
					<ServiceCard
						flexBasis={{ base: "100%", md: "auto" }}
						href="/dashboard/spotify"
						mr={{ base: 0, md: 4 }}
						mb={4}
						serviceName="Spotify">
						<SpotifyIcon />
					</ServiceCard>
				)}
				{isLoggedInWithGoogle && (
					<ServiceCard
						flexBasis={{ base: "100%", md: "auto" }}
						href="/dashboard/youtube"
						mr={{ base: 0, md: 4 }}
						mb={4}
						serviceName="Youtube Music">
						<YoutubeMusicIcon />
					</ServiceCard>
				)}
				{!(isLoggedInWithGoogle && isLoggedInWithSpotify) && (
					<ServiceCardWrapper
						mb={4}
						flexBasis={{ base: "100%", md: "auto" }}
						onClick={onOpen}>
						<Center h="full" px={6}>
							<Icon
								color={addIconColor}
								w={16}
								h={16}
								as={IoAdd}
							/>
						</Center>
					</ServiceCardWrapper>
				)}
			</Flex>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Service</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack gap={3}>
							{!isLoggedInWithSpotify && <ConnectSpotifyButton />}
							{!isLoggedInWithGoogle && (
								<ConnectYoutubeButton
									googleAuthUrl={googleAuthUrl}
								/>
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
	googleAuthUrl: string;
	error: string | null;
}>(async (_context, _session, sessionData) => {
	let user = await getUserWithoutDatesAndPassword(sessionData.user.id);
	const param = _context.query.toast || null;

	if (!user) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
				error: null,
			},
		};
	}

	const googleAuthUrl = generateAuthUrl();

	if (param == "spotify") {
		if (await isUserConnected(sessionData.user)) {
			return {
				props: {
					user,
					googleAuthUrl,
					error: "spotify_user_already_authenticated",
				},
			};
		}

		const clientId = getEnvVar("SPOTIFY_CLIENT_ID");
		const clientSecret = getEnvVar("SPOTIFY_CLIENT_SECRET");
		const baseUrl = getEnvVar("BASE_URL");

		const code = _context.query.code || null;
		const error = _context.query.error || null;
		const state = _context.query.state || null;

		const previousState = _context.req.cookies.spotify_state;

		if (error !== null) {
			return {
				props: {
					user,
					googleAuthUrl,
					error: error.toString(),
				},
			};
		}

		if (state === null) {
			return {
				props: {
					user,
					googleAuthUrl,
					error: "state_is_null",
				},
			};
		}

		if (state !== previousState) {
			return {
				props: {
					user,
					googleAuthUrl,
					error: "state_mismatch",
				},
			};
		}

		const {
			resData,
			error: resError,
			errorMessage,
			status,
		} = await postRequest<{
			access_token: string;
			refresh_token: string;
		}>("https://accounts.spotify.com/api/token", {
			body: queryString.stringify({
				code: code,
				redirect_uri: `${baseUrl}/dashboard?toast=spotify`,
				grant_type: "authorization_code",
			}),
			headers: {
				Authorization:
					"Basic " +
					new Buffer(clientId + ":" + clientSecret).toString(
						"base64",
					),
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		if (resError || !resData) {
			console.log(resData);
			console.log(resError);
			console.log(status);
			return {
				props: {
					user,
					googleAuthUrl,
					error: errorMessage || null,
				},
			};
		}

		const {
			resData: spotifyUser,
			error: spotifyUserError,
			errorMessage: spotifyUserErrorMessage,
			status: test,
		} = await getRequest<SpotifyUser>("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: `Bearer ${resData.access_token}`,
				"Content-Type": "application/json",
			},
			body: null,
		});

		if (!spotifyUser || spotifyUserError) {
			return {
				props: {
					user,
					googleAuthUrl,
					error: spotifyUserErrorMessage,
				},
			};
		}

		await setSpotifyUserId(sessionData.user, spotifyUser);
		await setSpotifyTokens(sessionData.user, resData);

		console.log("set up done");
	}

	if (param == "youtube") {
		if (!_context.req.url || !user) {
			return {
				notFound: true,
			};
		}

		const authCode = new URL(
			_context.req.url,
			getEnvVar("BASE_URL"),
		).searchParams.get("code");

		let error: string | null = null;

		if (!authCode) {
			error = "Parameter 'code' missing in url query parameters";
		}

		if (authCode) {
			try {
				await handleCallback(authCode, user.id);
			} catch (e: any) {
				error = e.message;
			}
		}
	}

	user = await getUserWithoutDatesAndPassword(sessionData.user.id);

	if (!user) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
				error: null,
			},
		};
	}

	return {
		props: {
			user,
			googleAuthUrl,
			error: null,
		},
	};
});

async function setSpotifyTokens(
	sessionUser: SessionUser,
	resData: { refresh_token: string; access_token: string },
) {
	await prisma.user.update({
		data: {
			spotifyAccessToken: resData.access_token,
			spotifyRefreshToken: resData.refresh_token,
		},
		where: {
			id: sessionUser.id,
		},
	});

	console.log("Tokens geupdatet");
}

async function setSpotifyUserId(
	sessionUser: SessionUser,
	spotifyUser: SpotifyUser,
) {
	await prisma.user.update({
		data: {
			spotifyUserId: spotifyUser.id,
		},
		where: {
			id: sessionUser.id,
		},
	});
	console.log("userId gesetzt");
}

async function isUserConnected(sessionUser: SessionUser): Promise<boolean> {
	const user = await prisma.user.findFirst({
		where: {
			id: sessionUser.id,
		},
	});

	return isUserLoggedInWithSpotify(user);
}

export default Index;
