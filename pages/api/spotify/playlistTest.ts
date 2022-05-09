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

    console.log(accessToken);

    const { error, errorMessage, responseData } = await getRequest(user!, 'https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy', {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    })

    console.log('error', error);
    console.log(errorMessage);
    console.log('data', responseData);

    return res.status(200).send(responseData);
})
