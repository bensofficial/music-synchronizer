import SpotifyIcon from "$/components/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import {Page} from "$types/next";
import {Heading, HStack, Tab, TabList, TabPanel, TabPanels, Tabs,} from "@chakra-ui/react";
import {useGetRequest} from "$lib/clientRequest";

const Index: Page = () => {

	const { loading, errorMessage, error, data } = useGetRequest<Record<string, never>>("/api/spotify/playlistTest");

	console.log(error)
	console.log(data);

	return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={16} w={16}></SpotifyIcon>
				<Heading>Spotify</Heading>
			</HStack>
			<Tabs variant="soft-rounded" mt={8}>
				<TabList>
					<Tab>Playlists</Tab>
					<Tab>Songs</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<PlaylistTable
							playlist={[
								{
									title: "2022",
									creator: "You",
									type: "public",
								},
							]}></PlaylistTable>
					</TabPanel>
					<TabPanel>
						<p>Songs</p>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
