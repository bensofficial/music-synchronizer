import {apiRequireAuth} from "$lib/auth";
import prisma from "$lib/prisma";

export default apiRequireAuth(async (_req, _res, _sessionUser) => {

    const user = await prisma.user.findFirst({
        where: {
            id: _sessionUser.id
        }
    });

    const accessToken = user?.spotifyAccessToken;

    console.log(accessToken);

    const response = await fetch('https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy', {
        headers: {
            'Authentication':'Bearer' + accessToken,
            'Content-Type': 'application/json'
        }
    })

    console.log(response)

    return _res.status(200).send(response);
})
