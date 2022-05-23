import { usePostRequest } from "$lib/clientRequest";
import { Playlist, playlistTypeToString } from "$lib/services/types";
import getSongId from "$lib/services/youtube/api/getSongId";
import {
	Table,
	TableContainer,
	TableContainerProps,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Button,
	Icon,
	Tag,
	Text,
} from "@chakra-ui/react";

import { AiOutlineSync } from "react-icons/ai";

export default function PlaylistTable({
	playlists,
	...props
}: TableContainerProps & {
	playlists: Playlist[];
}) {
	const { data, loading, error, send } = usePostRequest(
		"/api/youtube/songId",
	);
	return (
		<TableContainer {...props} my={8}>
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>Title</Th>
						<Th>Creator</Th>
						<Th>Type</Th>
						<Th>Synchronize</Th>
					</Tr>
				</Thead>
				<Tbody>
					{playlists.map((playlist, i) => (
						<Tr key={i}>
							<Td>
								<Text fontWeight="semibold">
									{playlist.title}
								</Text>
							</Td>
							<Td>{playlist.creator}</Td>
							<Td>
								<Tag>{playlistTypeToString(playlist.type)}</Tag>
							</Td>
							<Td>
								<Button
									onClick={() => {}}
									size="sm"
									leftIcon={<Icon as={AiOutlineSync} />}>
									Synchronize
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
}
