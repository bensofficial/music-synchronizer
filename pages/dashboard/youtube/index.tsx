import YoutubeMusicIcon from "$/components/icons/YoutubeMusicIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import { useGetRequest } from "$lib/clientRequest";
import { Playlist } from "$lib/services/types";
import { Page } from "$types/next";
import {
	Heading,
	HStack,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Spinner,
} from "@chakra-ui/react";

const Index: Page = () => {
	const { loading, data } = useGetRequest<Playlist[]>(
		"/api/youtube/playlists",
	);

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
<<<<<<< HEAD
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
=======
						{loading || !data ? (
							<Spinner></Spinner>
						) : (
							<PlaylistTable playlists={data}></PlaylistTable>
						)}
>>>>>>> 503bf53b955fc24a90fc4a434ed7712d17befdf8
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
