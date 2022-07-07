import {
	DisplayPlaylistFrontend,
	Playlist,
	ServiceName,
} from "$lib/services/types";
import { useEffect, useState } from "react";
import {
	HStack,
	Tabs,
	TabList,
	Tab,
	Center,
	Box,
	Text,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
} from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";
import PlaylistTable from "./PlaylistTable";
import { UserWithoutDatesAndPassword } from "$types/user";

export default function PlaylistTableWrapper({
	originService,
	playlists,
	user,
}: {
	user: UserWithoutDatesAndPassword;
	originService: ServiceName;
	playlists: DisplayPlaylistFrontend[];
}) {
	const resultsPerPage = 8;

	const [filteredPlaylists, setFilteredPlaylists] =
		useState<DisplayPlaylistFrontend[]>(playlists);
	const [pagePlaylists, setPagePlaylists] = useState<
		DisplayPlaylistFrontend[]
	>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [numberOfPages, setNumberOfPages] = useState(1);
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		setNumberOfPages(
			Math.max(Math.ceil(filteredPlaylists.length / resultsPerPage), 1),
		);
	}, [filteredPlaylists]);

	useEffect(() => {
		if (currentPage > numberOfPages) {
			setCurrentPage(numberOfPages);
		}
	}, [numberOfPages, currentPage]);

	useEffect(() => {
		const input = searchInput.toLowerCase();

		setFilteredPlaylists(
			playlists.filter(
				(playlist) => playlist.title.toLowerCase().search(input) > -1,
			),
		);
	}, [playlists, searchInput]);

	useEffect(() => {
		const start = Math.min(
			(currentPage - 1) * resultsPerPage,
			filteredPlaylists.length - 1,
		);
		const end = Math.min(
			currentPage * resultsPerPage,
			filteredPlaylists.length - 1,
		);

		setPagePlaylists(filteredPlaylists.slice(start, end + 1));
	}, [filteredPlaylists, currentPage]);

	return (
		<Tabs variant="soft-rounded" mt={8}>
			<HStack justifyContent="space-between">
				<TabList>
					<Tab>Playlists</Tab>
				</TabList>
				<Box>
					<InputGroup>
						<InputLeftElement>
							<FiSearch></FiSearch>
						</InputLeftElement>
						<Input
							value={searchInput}
							onChange={(e) => {
								setSearchInput(e.target.value);
							}}
							placeholder="Search..."
							variant="filled"
							w={80}
						/>
					</InputGroup>
				</Box>
			</HStack>
			<Text mt={4} fontWeight="thin" fontSize="xl">
				Page {currentPage} / {numberOfPages}
			</Text>
			<PlaylistTable
				user={user}
				originService={originService}
				playlists={pagePlaylists}
			/>
			<Center mb={4}>
				<IconButton
					borderRadius="full"
					aria-label="previous page"
					icon={<FiArrowLeft />}
					disabled={currentPage <= 1}
					onClick={() => {
						setCurrentPage(currentPage - 1);
					}}
				/>
				<IconButton
					ml={4}
					borderRadius="full"
					aria-label="next page"
					icon={<FiArrowRight />}
					disabled={currentPage >= numberOfPages}
					onClick={() => {
						setCurrentPage(currentPage + 1);
					}}
				/>
			</Center>
		</Tabs>
	);
}
