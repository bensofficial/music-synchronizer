import SpotifyIcon from "$components/services/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import { PlaylistType } from "$lib/services/types";
import { Page } from "$types/next";
import { Heading, HStack } from "@chakra-ui/react";
import PlaylistTableWrapper from "$components/services/playlists/PlaylistTableWrapper";
import { ssrRequireAuth } from "$lib/auth";
import { UserWithoutDatesAndPassword } from "$types/user";
import { getUserWithoutDatesAndPassword } from "$lib/db/user";
import { InferGetServerSidePropsType } from "next";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Index: Page<Props> = ({ user }: Props) => {
	return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={14} w={14}></SpotifyIcon>
				<Heading>Spotify</Heading>
			</HStack>
			<PlaylistTableWrapper
				user={user}
				originService="spotify"
				playlists={[
					{
						serviceId: "0",
						title: "2021",
						creator: "You",
						type: PlaylistType.public,
					},
				]}
			/>
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
