import SpotifyIcon from "$components/services/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import { Playlist, PlaylistType } from "$lib/services/types";
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
import { useGetRequest } from "$lib/clientRequest";

const Index: Page = () => {
	const { loading, errorMessage, error, data } = useGetRequest<Playlist[]>(
		"/api/spotify/playlists",
	);

	return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={14} w={14}></SpotifyIcon>
				<Heading>Spotify</Heading>
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

export const getServerSideProps = ssrRequireAuth<{
	user: UserWithoutDatesAndPassword;
}>(async (_context, _session, sessionData) => {
	const user = await getUserWithoutDatesAndPassword(sessionData.user.id);

	if (!user) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: {
			user,
		},
	};
});

Index.layout = DashboardLayout;

export default Index;
