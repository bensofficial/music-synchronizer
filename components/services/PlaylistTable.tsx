import {
	Table,
	TableContainer,
	TableContainerProps,
	TableCaption,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Button,
	Icon,
} from "@chakra-ui/react";

import { AiOutlineSync } from "react-icons/ai";

interface PlaylistItem {
	title: string;
	creator: string;
	type: "public" | "private" | "unlisted";
	length: number;
	youtubeId: string;
}

export default function PlaylistTable({
	playlist,
	synchronise,
	...props
}: TableContainerProps & {
	playlist: PlaylistItem[];
	synchronise: (playlist: PlaylistItem) => void;
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
					{playlist.map((playlistItem, i) => (
						<Tr key={i}>
							<Td>{playlistItem.title}</Td>
							<Td>{playlistItem.creator}</Td>
							<Td>{playlistItem.type}</Td>
							<Td>
								<Button
									onClick={() => synchronise(playlistItem)}
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
