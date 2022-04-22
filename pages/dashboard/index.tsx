import { SessionUser, ssrRequireAuth } from "$lib/auth";
import { useGetRequest, usePostRequest } from "$lib/clientRequest";
import { Button, Center, Heading, Spinner, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface AuthenticatedUser {
	email: string;
	id: number;
}

export default function Index() {
	const { loading, data } = useGetRequest<AuthenticatedUser>("/api/user");
	const {
		loading: logoutLoading,
		send: sendLogout,
		data: logoutData,
		error: logoutError,
	} = usePostRequest("/api/auth/logout");

	const router = useRouter();

	if (!logoutError && logoutData) {
		router.push("/login");
	}

	return (
		<Center h="100vh">
			{loading ? (
				<Spinner />
			) : (
				<VStack>
					<Heading>Welcome Back, {data?.email}</Heading>
					<Button
						isLoading={logoutLoading}
						onClick={() => {
							sendLogout();
						}}>
						Logout
					</Button>
				</VStack>
			)}
		</Center>
	);
}

export const getServerSideProps = ssrRequireAuth<{ sessionUser: SessionUser }>(
	(_ctx, sessionUser) => {
		return {
			props: {
				sessionUser,
			},
		};
	},
);
