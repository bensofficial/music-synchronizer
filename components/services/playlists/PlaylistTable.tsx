import {
	DisplayPlaylistFrontend,
	Playlist,
	playlistTypeToString,
	ServiceName,
} from "$lib/services/types";
import { UserWithoutDatesAndPassword } from "$types/user";
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
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineSync } from "react-icons/ai";
import SynchronizeModalBody from "../synchronize/SynchronizeModalBody";

export default function PlaylistTable({
	playlists,
	originService,
	user,
	...props
}: TableContainerProps & {
	user: UserWithoutDatesAndPassword;
	originService: ServiceName;
	playlists: DisplayPlaylistFrontend[];
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
		null,
	);

	return (
		<>
			<TableContainer {...props} my={8}>
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Title</Th>
							<Th>Type</Th>
							<Th>Synchronize</Th>
							<Th>Last Synchronized</Th>
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
								<Td>
									<Tag>
										{playlistTypeToString(playlist.type)}
									</Tag>
								</Td>
								<Td>
									<Button
										onClick={() => {
											setSelectedPlaylist(playlist);
											onOpen();
										}}
										size="sm"
										leftIcon={<Icon as={AiOutlineSync} />}>
										Synchronize
									</Button>
								</Td>
								<Td>
									{playlist.lastSynchronized
										? new Date(
												playlist.lastSynchronized,
										  ).toDateString()
										: ""}
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						Synchronize
						<Text fontWeight="thin">{selectedPlaylist?.title}</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedPlaylist && (
							<SynchronizeModalBody
								user={user}
								originService={originService}
								playlist={selectedPlaylist}
							/>
						)}
					</ModalBody>
					<ModalFooter />
				</ModalContent>
			</Modal>
		</>
	);
}
