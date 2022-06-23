import { User } from "@prisma/client";
import { postRequest } from "../request";
import { SpotifyPlaylist } from "../types";

export default async function createPlaylist(user: User, name: string) {
	const { error, errorMessage, resData } = await postRequest<SpotifyPlaylist>(
		`https://api.spotify.com/v1/users/${user.spotifyUserId}/playlists`,
		user,
		{
			name,
		},
	);

	if (error || !resData) {
		throw new Error(errorMessage);
	}

	return resData.id;
}
