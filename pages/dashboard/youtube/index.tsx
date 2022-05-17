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
