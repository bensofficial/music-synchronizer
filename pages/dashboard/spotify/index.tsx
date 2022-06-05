import SpotifyIcon from "$components/services/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import { PlaylistType } from "$lib/services/types";
import { Page } from "$types/next";
import { Heading, HStack } from "@chakra-ui/react";
import PlaylistTableWrapper from "$components/services/playlists/PlaylistTableWrapper";

const Index: Page = () => {
	return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={14} w={14}></SpotifyIcon>
				<Heading>Spotify</Heading>
			</HStack>
			<PlaylistTableWrapper
				originService="spotify"
				playlists={[
					{
						id: "0",
						title: "2022",
						creator: "You",
						type: PlaylistType.public,
					},
				]}
			/>
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
