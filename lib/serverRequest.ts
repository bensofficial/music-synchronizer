import {User} from "@prisma/client";

export function getRequest(user: User, uri: string, authOptions: RequestInit = {}) {
    return request(user, uri, authOptions);
}

async function request(user: User, uri: string, authOptions: RequestInit) {

    if (uri.startsWith('https://api.spotify.com')) {
        authOptions.headers = {
            'Authorization': 'Bearer ' + user.spotifyAccessToken,
            'Content-Type': 'application/json'
        }
    }

    let error: boolean;
    let errorMessage = "";
    let responseData = null;

    const res: Response = await fetch(uri, authOptions)

    error = !res.ok;

    responseData = await res.json()

    if (error) {
        try {
            errorMessage = responseData.error.message;
        } catch (e) {}
    }

    return { error, errorMessage, responseData };
}
