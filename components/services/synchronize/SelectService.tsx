import Link from "$components/chakra/Link";
import { isUserLoggedInWithSpotify } from "$lib/services/spotify/auth";
import { ServiceName } from "$lib/services/types";
import { userIsLoggedInWithGoogle } from "$lib/services/youtube/authFrontend";
import { UserWithoutDatesAndPassword } from "$types/user";
import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import SpotifyIcon from "../icons/SpotifyIcon";
import YoutubeMusicIcon from "../icons/YoutubeMusicIcon";
import SelectServiceButton from "./SelectServiceButton";

export default function SelectService({
	originService,
	service,
	setService,
	user,
}: {
	user: UserWithoutDatesAndPassword;
	originService: ServiceName;
	service: ServiceName | null;
	setService: Dispatch<SetStateAction<ServiceName | null>>;
}) {
	const services = [
		{
			name: "spotify",
			icon: (
				<SelectServiceButton
					key="spotify"
					selected={service == "spotify"}
					onClick={() => {
						setService(service == "spotify" ? null : "spotify");
					}}>
					<SpotifyIcon />
				</SelectServiceButton>
			),
			connected: isUserLoggedInWithSpotify(user),
		},
		{
			name: "youtube",
			icon: (
				<SelectServiceButton
					key="youtube"
					selected={service == "youtube"}
					onClick={() => {
						setService(service == "youtube" ? null : "youtube");
					}}>
					<YoutubeMusicIcon />
				</SelectServiceButton>
			),
			connected: userIsLoggedInWithGoogle(user),
		},
	];

	const displayServices = services.filter(
		(service) => service.name !== originService && service.connected,
	);

	return (
		<Flex justifyContent="center" my={8} flexWrap="wrap" w="full">
			{displayServices.length === 0 ? (
				<VStack>
					<Icon as={AiOutlineDisconnect} h={8} w={8} />
					<Text fontSize="large">
						Please{" "}
						<Link href="/dashboard" color="brand.400">
							connect to a second Service
						</Link>
					</Text>
				</VStack>
			) : (
				displayServices.map((service) => service.icon)
			)}
		</Flex>
	);
}
