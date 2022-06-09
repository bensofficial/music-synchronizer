import { ServiceName } from "$lib/services/types";
import {
	Box,
	Center,
	Spinner,
	Text,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";

export default function SynchronizePlaylist({
	service,
	playlistId,
}: {
	service: ServiceName;
	playlistId: string;
}) {
	return (
		<Center my={8}>
			<VStack gap={8}>
				<Spinner h={24} w={24} color="brand.500" thickness="4px" />
				<Text textAlign="center" fontWeight="light" fontSize="larger">
					Synchronizing Playlist {service} {playlistId} <br /> This
					might take a while
				</Text>
			</VStack>
		</Center>
	);
}
