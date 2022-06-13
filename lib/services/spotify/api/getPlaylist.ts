import { User } from "@prisma/client";
import { Playlist } from "$lib/services/types";
import { getRequest } from "../request";
import { SpotifyPlaylist } from "../types";
import { spotifyPlaylistToPlaylist } from "./convert";

export default async function getPlaylist(
	user: User,
	playlistId: string,
): Promise<Playlist | null> {
	const { resData, error, errorMessage } = await getRequest<SpotifyPlaylist>(
		`https://api.spotify.com/v1/playlists/${playlistId}`,
		user,
	);

	if (!resData || error) {
		throw new Error(errorMessage);
	}

	return spotifyPlaylistToPlaylist(resData);
}
