import Link from "$components/chakra/Link";
import { useGetRequest } from "$lib/request/clientRequest";
import { Button, ButtonProps, HStack, Spinner } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function Buttons({
	children,
	...props
}: PropsWithChildren<ButtonProps>) {
	const { data, loading } = useGetRequest<{ isLoggedIn: boolean }>(
		"/api/auth/loggedIn",
	);

	if (loading || !data) {
		return <Spinner />;
	}

	return (
		<HStack>
			{data.isLoggedIn ? (
				children
			) : (
				<>
					<Button {...props} variant="outline">
						<Link href="/login">Login</Link>
					</Button>
					<Button {...props}>
						<Link href="/register">Sign Up</Link>
					</Button>
				</>
			)}
		</HStack>
	);
}
