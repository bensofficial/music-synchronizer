import { Center } from "@chakra-ui/react";
import {SessionUser, ssrRequireAuth} from "$lib/auth";
import AuthWithSpotifyButton from "$app/buttons/authButton/authWithSpotify";

export default function Login() {

    return (
        <div>
            <Center h="100vh">
                <AuthWithSpotifyButton></AuthWithSpotifyButton>
            </Center>
        </div>
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
