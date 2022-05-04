import { Center } from "@chakra-ui/react";
import {SessionUser, ssrRequireAuth} from "$lib/auth";
import AuthWithSpotifyButton from "$app/buttons/authButton/authWithSpotify";
import {Button} from "@chakra-ui/theme/components";
import {BsSpotify} from "react-icons/bs";
import {requestNewAccessToken} from "$lib/spotify/requestNewAccessToken";

export default function Login() {

    return (
        <div>
            <Center h="100vh">
                <AuthWithSpotifyButton></AuthWithSpotifyButton>
            </Center>
            <Center h="100vh">
            </Center>
        </div>
    )
}

export const getServerSideProps = ssrRequireAuth<{ sessionUser: SessionUser }> (
    (_ctx, sessionUser) => {

        requestNewAccessToken(sessionUser).then(r => r);

        return {
            props: {
                sessionUser: sessionUser,
            },
        };
    },
);
