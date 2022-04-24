import { Center, Heading } from "@chakra-ui/react";
import * as queryString from "query-string";
import {SessionUser, ssrRequireAuth} from "$lib/auth";
import {InferGetServerSidePropsType} from "next";
import Cookies from "js-cookie";
import prisma from "$lib/prisma";

function Callback({ error }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    if (error !== null) {
        console.log('Es gab ein Error: ', error)
    }

    return (
        <Center h="100vh">
            { error === null
                ? (<Heading>Du hast dich erfolgreich mit Spotify Authentifiziert 👍</Heading>)
                : (<Heading>😔 {error}</Heading>)
            }
        </Center>
    )
}

export default Callback;

export const getServerSideProps = ssrRequireAuth<{ error: string | null, sessionUser: SessionUser }> (
    (_ctx, sessionUser) => {

        const clientId = process.env.SPOTIFY_CLIENT_ID
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI

        const code = _ctx.query.code || null;
        const error = _ctx.query.error || null;
        const state = _ctx.query.state || null;

        const previousState = _ctx.req.cookies.spotify_state

        if (error !== null) {
            return {
                props: {
                    error: error.toString(),
                    sessionUser: sessionUser
                }
            }
        }

        if (state === null) {
            return {
                props: {
                    error: 'state_is_null',
                    sessionUser: sessionUser
                },
            };
        }

        if (state !== previousState) {
            return {
                props: {
                    error: 'state_mismatch',
                    sessionUser: sessionUser
                }
            }
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
            const data = await response.json();

            prisma.user.update({
                data: {
                    spotifyAccessToken: data.access_token,
                    spotifyRefreshToken: data.refresh_token,
                },
                where: {
                    id: sessionUser.id
                }
            })
        })

        return {
            props: {
                error: null,
                sessionUser: sessionUser,
            },
        };
    },
);


