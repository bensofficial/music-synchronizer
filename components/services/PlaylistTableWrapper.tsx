import { Playlist, playlistTypeToString } from "$lib/services/types";
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

export default function PlaylistTableWrapper({
	playlists,
}: {
	playlists: Playlist[];
}) {
	const resultsPerPage = 7;

	const [filteredPlaylists, setFilteredPlaylists] =
		useState<Playlist[]>(playlists);
	const [pagePlaylists, setPagePlaylists] = useState<Playlist[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [numberOfPages, setNumberOfPages] = useState(1);
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		setNumberOfPages(Math.ceil(filteredPlaylists.length / resultsPerPage));
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
				(playlist) =>
					playlist.creator.toLowerCase().search(input) > -1 ||
					playlist.title.toLowerCase().search(input) > -1 ||
					playlistTypeToString(playlist.type).search(input) > -1,
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
							w={80}></Input>
					</InputGroup>
				</Box>
			</HStack>
			<Text mt={4} fontWeight="thin" fontSize="xl">
				Page {currentPage} / {numberOfPages}
			</Text>
			<PlaylistTable playlists={pagePlaylists}></PlaylistTable>
			<Center mb={8}>
				<IconButton
					borderRadius="full"
					aria-label="previous page"
					icon={<FiArrowLeft></FiArrowLeft>}
					disabled={currentPage <= 1}
					onClick={() => {
						setCurrentPage(currentPage - 1);
					}}></IconButton>
				<IconButton
					ml={4}
					borderRadius="full"
					aria-label="next page"
					icon={<FiArrowRight></FiArrowRight>}
					disabled={currentPage >= numberOfPages}
					onClick={() => {
						setCurrentPage(currentPage + 1);
					}}></IconButton>
			</Center>
		</Tabs>
	);
}
