import {SessionUser} from "$lib/auth";
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
    const requestData = {
        method: 'GET',
        form: queryString.stringify({
            grant_type: 'refresh_token',
            refresh_toke: 'authorization_code',
        }),
        headers: {
            'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')),
        },
        json: true
    }

    fetch('https://accounts.spotify.com/api/token', requestData).then(async (response) => {
        console.log(response);
    })

    return {
        data: null,
        error: null
    }
}
