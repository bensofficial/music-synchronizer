import { SessionUser } from "$lib/auth";
import prisma from "$lib/prisma";
import * as queryString from "query-string";

//TODO: Ich glaube hier ist es useless was zu returnen oder? Wie macht man dann das mit dem Error? Eine Exception?
export async function requestNewAccessToken(sessionUser: SessionUser): Promise<{ data: any, error: any }> {

    const user = await prisma.user.findFirst({
        where: {
            id: sessionUser.id
        }
    });

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = user?.spotifyRefreshToken;

    //TODO: mit methode von Simon austauschen
    if (refreshToken == '') {
        return {
            data: null,
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
            data: null,
            error: 'token_still_valid'
        }
    }

    await setNewToken(response, sessionUser);

    return {
        data: null,
        error: null
    }
}

async function setNewToken(response: Response, sessionUser: SessionUser) {
    const data = await response.json();

    await prisma.user.update({
        data: {
            spotifyAccessToken: data.access_token,
        },
        where: {
            id: sessionUser.id
        }
    })
}
