import YoutubeMusicIcon from "$/components/icons/YoutubeMusicIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import LoadGoogleApi from "$/components/youtube/loadGoogleApi";
import getPlaylists from "$lib/youtube/getPlaylists";
import { YoutubePlaylist } from "$lib/youtube/YoutubePlaylist";
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
import { useState } from "react";

const Index: Page = () => {
	const [playlists, setPlaylists] = useState<YoutubePlaylist[]>([]);

	return (
		<>
			<LoadGoogleApi
				onLoad={async () => {
					const fetchedPlaylists = await getPlaylists();
					if (fetchedPlaylists) setPlaylists(fetchedPlaylists);
				}}
			/>
			<HStack gap={5}>
				<YoutubeMusicIcon h={16} w={16}></YoutubeMusicIcon>
				<Heading>Youtube Music</Heading>
			</HStack>
			<Tabs variant="soft-rounded" mt={8}>
				<TabList>
					<Tab>Playlists</Tab>
					<Tab>Songs</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<PlaylistTable playlist={playlists}></PlaylistTable>
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
