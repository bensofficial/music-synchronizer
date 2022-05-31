import YoutubeMusicIcon from "$/components/icons/YoutubeMusicIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import DisplayError from "$components/error/DisplayError";
import PlaylistTableWrapper from "$components/services/PlaylistTableWrapper";
import { useGetRequest } from "$lib/clientRequest";
import { Playlist } from "$lib/services/types";
import { Page } from "$types/next";
import { Heading, HStack, Spinner, Center } from "@chakra-ui/react";

const Index: Page = () => {
	const { loading, data, error, errorMessage } = useGetRequest<Playlist[]>(
		"/api/youtube/playlists",
	);

	return (
		<>
			<HStack>
				<YoutubeMusicIcon h={14} w={14}></YoutubeMusicIcon>
				<Heading>Youtube Music</Heading>
			</HStack>

			{loading || !data ? (
				<Center>
					<Spinner></Spinner>
				</Center>
			) : error ? (
				<DisplayError mt={8} errorMessage={errorMessage}></DisplayError>
			) : (
				<PlaylistTableWrapper playlists={data} />
			)}
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
