import { User } from "@prisma/client";
import { Playlist } from "$lib/services/types";
import { getRequest } from "$lib/services/spotify/request";
import { spotifyPlaylistsToPlaylists } from "$lib/services/spotify/api/convert";

export default async function getPlaylists(
	user: User,
): Promise<Playlist[] | Error> {
	const { responseData } = await getRequest(
		`https://api.spotify.com/v1/users/${user.spotifyUserId}/playlists`,
		user,
	);

	return spotifyPlaylistsToPlaylists(responseData.items);
}
