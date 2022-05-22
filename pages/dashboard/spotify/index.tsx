import SpotifyIcon from "$/components/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import { PlaylistType } from "$lib/services/types";
import { Page } from "$types/next";
import {
	Heading,
	HStack,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";
import { useGetRequest } from "$lib/clientRequest";

const Index: Page = () => {
	const { loading, errorMessage, error, data } = useGetRequest<
		Record<string, never>
	>("/api/spotify/playlistTest");

	return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={16} w={16}></SpotifyIcon>
				<Heading>Spotify</Heading>
			</HStack>
			<Tabs variant="soft-rounded" mt={6}>
				<TabList>
					<Tab>Playlists</Tab>
				</TabList>
				<TabPanels>
					<TabPanel px={0}>
						<PlaylistTable
							playlists={[
								{
									id: "0",
									title: "2022",
									creator: "You",
									type: PlaylistType.public,
								},
							]}></PlaylistTable>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
