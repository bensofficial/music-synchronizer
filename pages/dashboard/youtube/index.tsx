import YoutubeMusicIcon from "$/components/icons/YoutubeMusicIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import LoadGoogleApi from "$/components/youtube/loadGoogleApi";
import findSongID from "$lib/youtube/findSongID";
import getPlaylists from "$lib/youtube/getPlaylists";
import getVideosInPlaylist from "$lib/youtube/getVideosInPlaylist";
import insertSongInPlaylist from "$lib/youtube/insertSongInPlaylist";
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
						<PlaylistTable
							playlist={playlists}
							synchronise={async (playlist) => {
								const testVid = {
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
								console.log(playlistContent);
							}}></PlaylistTable>
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
