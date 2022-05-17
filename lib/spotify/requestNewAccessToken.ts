import { SessionUser } from "$lib/auth";
import prisma from "$lib/prisma";
import * as queryString from "query-string";
import {isUserLoggedInWithSpotify} from "$lib/spotify/auth";
import {data} from "browserslist";

export async function requestNewAccessToken(sessionUser: SessionUser): Promise<{ accessToken: string | null | undefined, error: any }> {

    const user = await prisma.user.findFirst({
        where: {
            id: sessionUser.id
        }
    });

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = user?.spotifyRefreshToken;

    if (!isUserLoggedInWithSpotify({spotifyRefreshToken: user!.spotifyRefreshToken})) {
        return {
            accessToken: null,
            error: 'user_is_not_authenticated'
        }
    }

    const authOptions = {
        method: 'POST',
        body: queryString.stringify({
            grant_type: 'refresh_token',
            refresh_toke: refreshToken,
        }),
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    }

    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);

    if (response.status == 400) {
        return {
            accessToken: null,
            error: 'token_still_valid'
        }
    }

    await setNewToken(response, sessionUser);

    return {
        accessToken: data.access_token?.toString(),
        error: null
    }
}

async function setNewToken(response: Response, sessionUser: SessionUser) {
    const data = await response.json();

    await prisma.user.update({
        data: {
            spotifyAccessToken: data.access_token.toString(),
        },
        where: {
            id: sessionUser.id
        }
    })
}