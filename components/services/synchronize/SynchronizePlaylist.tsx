import DisplayError from "$components/error/DisplayError";
import { usePostRequest } from "$lib/request/clientRequest";
import { ServiceName } from "$lib/services/types";
import {
	Button,
	Center,
	Icon,
	ScaleFade,
	Spinner,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { AiOutlineSync } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function SynchronizePlaylist({
	destService,
	originService,
	destPlaylistId,
	originPlaylistId,
}: {
	destService: ServiceName;
	originService: ServiceName;
	destPlaylistId: string;
	originPlaylistId: string;
}) {
	const { error, errorMessage, data, loading, send } =
		usePostRequest("/api/synchronize");

	return (
		<Center my={8}>
			<VStack gap={8}>
				{data && !error ? (
					<>
						<ScaleFade initialScale={0} in={true}>
							<Icon
								as={IoIosCheckmarkCircleOutline}
								h={32}
								w={32}
								color="green.400"
							/>
						</ScaleFade>
						<Text fontWeight="bold">
							Successfully synchronized your playlist!
						</Text>
					</>
				) : error ? (
					<DisplayError errorMessage={errorMessage} />
				) : loading ? (
					<>
						<Spinner
							h={24}
							w={24}
							color="brand.500"
							thickness="4px"
						/>
						<Text
							textAlign="center"
							fontWeight="light"
							fontSize="larger">
							Synchronizing Playlist
							<br /> This might take a while
						</Text>
					</>
				) : (
					<Button
						size="lg"
						variant="outline"
						rightIcon={<Icon as={AiOutlineSync} />}
						onClick={() => {
							send({
								originService,
								destinationService: destService,
								originPlaylistId,
								destinationPlaylistId: destPlaylistId,
							});
						}}>
						Synchronize Playlist
					</Button>
				)}
			</VStack>
		</Center>
	);
}
