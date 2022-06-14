import { User } from "@prisma/client";
import { postRequest } from "../request";

export async function addToPlaylist(
	user: User,
	playlistId: string,
	songIds: string[],
) {
	for (let i = 0; i < songIds.length; i += 100) {
		const chunk = songIds.slice(i, i + 100);

		await add100SongsToPlaylist(playlistId, user, chunk);
	}
}

async function add100SongsToPlaylist(
	playlistId: string,
	user: User,
	songIds: string[],
) {
	const { error, errorMessage } = await postRequest(
		`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
		user,
		{
			uris: songIds.map((songId) => `spotify:track:${songId}`),
		},
	);

	if (error) {
		throw new Error(errorMessage);
	}

	return;
}
