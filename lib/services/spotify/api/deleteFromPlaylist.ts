import { User } from "@prisma/client";
import { deleteRequest } from "../request";

export default async function deleteFromPlaylist(
	user: User,
	playlistId: string,
	songIds: string[],
) {
	for (let i = 0; i < songIds.length; i += 100) {
		const chunk = songIds.slice(i, i + 100);

		await delete100SongsFromPlaylist(user, playlistId, chunk);
	}
}

export async function delete100SongsFromPlaylist(
	user: User,
	playlistId: string,
	songIds: string[],
) {
	const { error, errorMessage } = await deleteRequest(
		`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
		user,
		{
			tracks: songIds.map((songId) => {
				return {
					uri: `spotify:track:${songId}`,
				};
			}),
		},
	);

	if (error) {
		throw new Error(errorMessage);
	}

	return;
}
