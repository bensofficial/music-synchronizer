import YoutubeMusicIcon from "$components/services/icons/YoutubeMusicIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import DisplayError from "$components/error/DisplayError";
import PlaylistTableWrapper from "$components/services/playlists/PlaylistTableWrapper";
import { useGetRequest } from "$lib/clientRequest";
import { Playlist } from "$lib/services/types";
import { Page } from "$types/next";
import { Heading, HStack, Spinner, Center } from "@chakra-ui/react";
import { ssrRequireAuth } from "$lib/auth";
import { getUserWithoutDatesAndPassword } from "$lib/db/user";
import { UserWithoutDatesAndPassword } from "$types/user";
import { InferGetServerSidePropsType } from "next";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;
const Index: Page<Props> = ({ user }: Props) => {
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
				<PlaylistTableWrapper
					user={user}
					originService="youtube"
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
