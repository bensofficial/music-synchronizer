import Link from "$components/chakra/Link";
import { ssrRequireAuth } from "$lib/auth";
import { Button, Center, Heading } from "@chakra-ui/react";
import prisma from "$lib/prisma";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import getEnvVar from "$lib/env";
import { handleCallback } from "$lib/services/youtube/authServer";

export default function Youtube({
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<Center h="100vh" w="100vw">
			<Heading>
				{!error ? "Authentication with Youtube was successful" : error}
			</Heading>
			<Link href="/dashboard" textDecoration={"none"}>
				<Button>Return to Dashboard</Button>
			</Link>
		</Center>
	);
}

export const getServerSideProps = ssrRequireAuth<{ error: string | null }>(
	async (context, _session, sessionData) => {
		console.log("executing callback");

		const user = await prisma.user.findUnique({
			where: { id: sessionData.user.id },
			select: {
				id: true,
			},
		});

		if (!context.req.url || !user) {
			return {
				notFound: true,
			};
		}

		const authCode = new URL(
			context.req.url,
			getEnvVar("BASE_URL"),
		).searchParams.get("code");

		let error: string | null = null;

		if (!authCode) {
			error = "Parameter 'code' missing in url query parameters";
		}

		if (authCode) {
			try {
				await handleCallback(authCode, user.id);
			} catch (e: any) {
				error = e.message;
			}
		}

		return {
			props: {
				error,
			},
		};
	},
);
