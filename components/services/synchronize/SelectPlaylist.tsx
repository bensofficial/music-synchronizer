import { useGetRequest } from "$lib/clientRequest";
import { Playlist, ServiceName } from "$lib/services/types";
import { Box, Spinner, VStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SelectPlaylistButton from "./SelectPlaylistButton";

export default function SelectPlaylist({
	destinationService,
	playlistId,
	setPlaylistId,
	playlist,
}: {
	destinationService: ServiceName;
	playlistId: string | null;
	setPlaylistId: Dispatch<SetStateAction<string | null>>;
	playlist: Playlist;
}) {
	const { loading, data } = useGetRequest<{} | Playlist>(
		`/api/${destinationService}/getPlaylist?title=${playlist.title}`,
	);
	const [playlistExists, setPlaylistExists] = useState(false);

	useEffect(() => {
		setPlaylistExists(data ? Object.keys(data).length > 0 : false);
	}, [data]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<VStack my={8}>
			{data && (
				<>
					<SelectPlaylistButton
						onClick={() => {
							setPlaylistId("create");
						}}
						selected={
							playlistId !== null && playlistId === "create"
						}
						mb="4"
						playlist={null}
					/>

					{playlistExists && (
						<SelectPlaylistButton
							onClick={() => {
								setPlaylistId(playlist.serviceId);
							}}
							selected={
								playlistId !== null && playlistId !== "create"
							}
							playlist={playlist}
						/>
					)}
				</>
			)}
		</VStack>
	);
}
