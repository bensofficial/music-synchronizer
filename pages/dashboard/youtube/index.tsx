import YoutubeMusicIcon from "$/components/icons/YoutubeMusicIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import DisplayError from "$components/error/DisplayError";
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
	Center,
	Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Index: Page = () => {
	const [nextPageToken, setNextPageToken] = useState<
		string | null | undefined
	>(null);
	const [prevPageToken, setPrevPageToken] = useState<
		string | null | undefined
	>(null);
	const [pageToken, setPageToken] = useState<string | null | undefined>(null);
	const { loading, data, error, errorMessage, send } = useGetRequest<{
		playlists: Playlist[];
		nextPageToken: string | null | undefined;
		prevPageToken: string | null | undefined;
	}>(
		`/api/youtube/playlists?maxResults=15${
			pageToken ? `&pageToken=${pageToken}` : ""
		}`,
		false,
	);

	useEffect(() => {
		send();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageToken]);

	if (data && nextPageToken !== data.nextPageToken) {
		setNextPageToken(data.nextPageToken);
	}

	if (data && prevPageToken !== data.prevPageToken) {
		setPrevPageToken(data.prevPageToken);
	}

	return (
		<>
			<HStack gap={5}>
				<YoutubeMusicIcon h={16} w={16}></YoutubeMusicIcon>
				<Heading>Youtube Music</Heading>
			</HStack>
			<Tabs variant="soft-rounded" mt={6}>
				<TabList>
					<Tab>Playlists</Tab>
				</TabList>
				<TabPanels>
					<TabPanel px={0}>
						{loading || !data ? (
							<Center>
								<Spinner></Spinner>
							</Center>
						) : error ? (
							<DisplayError
								errorMessage={errorMessage}></DisplayError>
						) : (
							<PlaylistTable
								playlists={data.playlists}></PlaylistTable>
						)}
					</TabPanel>
				</TabPanels>
			</Tabs>
			<Button
				onClick={() => {
					setPageToken(nextPageToken);
				}}>
				Next Page
			</Button>
			<Button
				onClick={() => {
					setPageToken(prevPageToken);
				}}>
				Previous Page
			</Button>
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
