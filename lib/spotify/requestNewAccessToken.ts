import { SessionUser } from "$lib/auth";
import prisma from "$lib/prisma";
import * as queryString from "query-string";

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

    const requestData = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form:{
            grant_type: 'refresh_token',
            refresh_toke: refreshToken,
        },
        json: true
    }

    const response = await fetch('https://accounts.spotify.com/api/token', requestData);

    console.log(response);

    return {
        data: null,
        error: null
    }
}
