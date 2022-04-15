import { Center, Button } from "@chakra-ui/react";
import {usePostRequest} from "$lib/clientRequest";

export function Login() {

    const { loading, errorMessage, error, send, data } =
        usePostRequest<Record<string, never>>("/api/spotify/login");

    return (
        <Center h="100vh">
            <a href="/api/spotify/login">
                <Button>
                    Auth with Spotify
                </Button>
            </a>

        </Center>
    )
}

export default Login
