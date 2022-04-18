import { Center, Button } from "@chakra-ui/react";
import {SessionUser, ssrRequireAuth} from "$lib/auth";
import Link from 'next/link'

export default function Login() {

    return (
        <Center h="100vh">
            <Link href="/api/spotify/login">
                <a>
                    <Button>Connect with Spotify</Button>
                </a>
            </Link>
        </Center>
    )
}

export const getServerSideProps = ssrRequireAuth<{ sessionUser: SessionUser }> (
    (_ctx, sessionUser) => {
        return {
            props: {
                sessionUser: sessionUser,
            },
        };
    },
);
