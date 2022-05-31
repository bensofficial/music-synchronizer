import {User} from "@prisma/client";
import {Playlist} from "$lib/services/types";
import {getRequest} from "$lib/serverRequest";
import {spotifyPlaylistsToPlaylists} from "$lib/services/spotify/api/convert";

export default async function getPlaylists(user: User): Promise<Playlist[] | Error> {

    const accessToken = user.spotifyAccessToken;
    const userId = user.spotifyUserId;

    const {error, errorMessage, responseData} = await getRequest(accessToken, `https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "GET",
    }, user)

    return spotifyPlaylistsToPlaylists(responseData.items);
}
