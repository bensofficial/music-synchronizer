import { Center, Button } from "@chakra-ui/react";

export function Login() {

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
