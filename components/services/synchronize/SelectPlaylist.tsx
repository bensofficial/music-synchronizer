import { useGetRequest } from "$lib/request/clientRequest";
import { Playlist, ServiceName } from "$lib/services/types";
import { Spinner, VStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SelectPlaylistButton from "./SelectPlaylistButton";

function isEmptyObject(
	data: Record<string, any>,
): data is Record<string, never> {
	return Object.keys(data).length === 0;
}

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
	const { loading, data } = useGetRequest<{} | { playlistId: string }>(
		`/api/${destinationService}/getPlaylistId?title=${playlist.title}`,
	);
	const [playlistExists, setPlaylistExists] = useState(false);
	const [destPlaylistId, setDestPlaylistId] = useState<null | string>(null);

	useEffect(() => {
		setPlaylistExists(data ? Object.keys(data).length > 0 : false);
		if (data && !isEmptyObject(data)) {
			setDestPlaylistId(data.playlistId);
		}
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

					{playlistExists && destPlaylistId && (
						<SelectPlaylistButton
							onClick={() => {
								setPlaylistId(destPlaylistId);
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
