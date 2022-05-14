import YoutubeMusicIcon from "$/components/icons/YoutubeMusicIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
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

const Index: Page = () => {
	return (
		<>
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
						<PlaylistTable
							synchronise={async (playlist) => {
								/*const testVid = {
									title: "The ULTIMATE Movement Guide for Titanfall 2aaaa",
									author: "bryonato",
								};
								const id = await findSongID(testVid);
								if (id)
									insertSongInPlaylist(
										playlist.youtubeId,
										playlist.length,
										id,
									);
								const playlistContent =
									await getVideosInPlaylist(
										playlist.youtubeId,
										playlist.length,
									);
								console.log(playlistContent);*/
							}}
							playlist={[
								{
									title: "2022",
									creator: "Flosi21",
									type: "private",
									length: 0,
									youtubeId: "null",
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
