import {apiRequireAuth} from "$lib/auth";
import prisma from "$lib/prisma";
import {getRequest} from "$lib/serverRequest";
import {getUser} from "$lib/spotify/user/getUser";

export default apiRequireAuth(async (_req, _res, _session, sessionData) => {

    const { error, errorMessage, responseData } = await getUser(sessionData.user);

    if (error) {
        _res.status(409).send(errorMessage)
        return;
    }

    _res.status(200).send(responseData)
});
