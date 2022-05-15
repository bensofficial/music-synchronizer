import { Playlist, playlistTypeToString } from "$lib/services/types";
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
} from "@chakra-ui/react";

import { AiOutlineSync } from "react-icons/ai";

export default function PlaylistTable({
	playlists,
	...props
}: TableContainerProps & {
	playlists: Playlist[];
}) {
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
							<Td>{playlist.title}</Td>
							<Td>{playlist.creator}</Td>
							<Td>{playlistTypeToString(playlist.type)}</Td>
							<Td>
								<Button
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
