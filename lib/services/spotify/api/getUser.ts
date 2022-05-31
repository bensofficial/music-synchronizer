import prisma from "$lib/prisma";
import {getRequest} from "$lib/serverRequest";
import {SessionUser} from "$lib/auth";

export async function getUser(sessionUser: SessionUser): Promise<{ error: boolean, errorMessage: string, responseData: any }> {
    const user = await prisma.user.findFirst({
        where: {
            id: sessionUser.id,
        },
    });

    return await getRequest(user!.spotifyAccessToken, 'https://api.spotify.com/v1/me', {
        method: "GET",
    }, user!);
}
