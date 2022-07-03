import SpotifyIcon from "$components/services/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTableWrapper from "$components/services/playlists/PlaylistTableWrapper";
import {
	DisplayPlaylistFrontend,
	Playlist,
	PlaylistType,
} from "$lib/services/types";
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
} from "@chakra-ui/react";
import { useGetRequest } from "$lib/request/clientRequest";
import { ssrRequireAuth } from "$lib/auth";
import { UserWithoutDatesAndPassword } from "$types/user";
import { getUserWithoutDatesAndPassword } from "$lib/db/user";
import { InferGetServerSidePropsType } from "next";
import DisplayError from "$components/error/DisplayError";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Index: Page<Props> = ({ user }: Props) => {
	const { loading, errorMessage, error, data } = useGetRequest<
		DisplayPlaylistFrontend[]
	>("/api/spotify/playlists");

	return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={14} w={14}></SpotifyIcon>
				<Heading>Spotify</Heading>
			</HStack>
			{loading || !data ? (
				<Center>
					<Spinner />
				</Center>
			) : error ? (
				<DisplayError mt={8} errorMessage={errorMessage} />
			) : (
				<PlaylistTableWrapper
					user={user}
					originService="spotify"
					playlists={data}
				/>
			)}
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
