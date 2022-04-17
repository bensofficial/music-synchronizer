import { Center, Heading } from "@chakra-ui/react";
import * as queryString from "query-string";
import {SessionUser, ssrRequireAuth} from "$lib/auth";
import {InferGetServerSidePropsType} from "next";

function Callback({ error }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    if (error) {
        console.log('Es gab ein Error')
    }

    return (
        <Center h="100vh">
            <Heading>Du hast dich erfolgreich mit Spotify Authentifiziert 👍</Heading>
        </Center>
    )
}

export default Callback;

export const getServerSideProps = ssrRequireAuth<{ error: string | null, sessionUser: SessionUser }> (
    (_ctx, sessionUser) => {

        const cookies = _ctx.req.cookies

        const clientId = process.env.SPOTIFY_CLIENT_ID
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI

        const code = _ctx.query.code || null;
        const state = _ctx.query.state || null;

        const previousState = cookies.spotify_state

        console.log(previousState)

        if (state === null) {
            return {
                props: {
                    error: 'state_mismatch',
                    sessionUser: sessionUser
                },
            };
        }

        if (state !== previousState) {
            return {
                props: {
                    error: 'state_mismatch',
                    sessionUser: sessionUser
                },
            };
        }

        const authOptions = {
            method: 'POST',
            body: queryString.stringify({
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
            headers: {
                'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            json: true
        };

        fetch('https://accounts.spotify.com/api/token', authOptions).then(async (response) => {
            const data = response.json();
        })

        return {
            props: {
                error: null,
                sessionUser: sessionUser,
            },
        };
    },
);


