import { User } from "@prisma/client";
import { postRequest } from "../request";

export default async function createPlaylist(user: User, name: string) {
	const { error, errorMessage } = await postRequest(
		`https://api.spotify.com/v1/users/${user.spotifyUserId}/playlists`,
		user,
		{
			name,
		},
	);

	if (error) {
		throw new Error(errorMessage);
	}

	return;
}
