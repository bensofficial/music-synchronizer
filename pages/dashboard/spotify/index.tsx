import SpotifyIcon from "$/components/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import {Playlist, PlaylistType } from "$lib/services/types";
import { Page } from "$types/next";
import {
	Heading,
	HStack,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel, Spinner,
} from "@chakra-ui/react";
import {useGetRequest} from "$lib/clientRequest";

const Index: Page = () => {

	const { loading, errorMessage, error, data } = useGetRequest<Playlist[]>("/api/spotify/playlists");

	 return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={16} w={16}></SpotifyIcon>
				<Heading>Spotify</Heading>
			</HStack>
			<Tabs variant="soft-rounded" mt={8}>
				<TabList>
					<Tab>Playlists</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						{loading || !data ? (
							<Spinner></Spinner>
						) : (
							<PlaylistTable playlists={data}></PlaylistTable>
						)}
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
