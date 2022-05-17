import {apiRequireAuth} from "$lib/auth";
import prisma from "$lib/prisma";
import {getRequest} from "$lib/serverRequest";

export default apiRequireAuth(async (_req, res, _session, sessionData) => {

    console.log('Anfrage kommt rein');

    const user = await prisma.user.findFirst({
        where: {
            id: sessionData.user.id
        }
    });

    const accessToken = user?.spotifyAccessToken;
    const userId = user?.spotifyUserId;

    console.log('userId', userId)

    console.log('user', sessionData.user)
    console.log('accessToken ', accessToken);

    const { error, errorMessage, responseData } = await getRequest(accessToken!, `https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "GET",
    }, sessionData.user)

    console.log('error', error);
    console.log(errorMessage);
    console.log('data', responseData);

    return res.status(200).send(responseData);
})
