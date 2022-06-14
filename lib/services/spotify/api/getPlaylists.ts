import { User } from "@prisma/client";
import { Playlist } from "$lib/services/types";
import { getRequest } from "$lib/services/spotify/request";
import { spotifyPlaylistToPlaylist } from "$lib/services/spotify/api/convert";
import { SpotifyPlaylist } from "../types";

export default async function getAllPlaylists(user: User): Promise<Playlist[]> {
	let playlists: Playlist[] = [];
	let nextPageUrl:
		| string
		| null = `https://api.spotify.com/v1/users/${user.spotifyUserId}/playlists?limit=50`;

	do {
		const result: PlaylistBatchResult = await getPlaylistBatch(
			nextPageUrl,
			user,
		);

		nextPageUrl = result.nextPageUrl;
		playlists = playlists.concat(result.playlists);
	} while (nextPageUrl != null);

	return playlists;
}

type PlaylistBatchResult = {
	playlists: Playlist[];
	nextPageUrl: string | null;
	prevPageUrl: string | null;
};

async function getPlaylistBatch(pageUrl: string, user: User) {
	const { resData, error, errorMessage } = await getRequest<{
		items: SpotifyPlaylist[];
		next: string | null;
		previous: string | null;
	}>(pageUrl, user);

	if (error || !resData) {
		throw new Error(errorMessage);
	}

	const playlists = resData.items.map((playlist) =>
		spotifyPlaylistToPlaylist(playlist),
	);

	return {
		playlists,
		nextPageUrl: resData.next,
		prevPageUrl: resData.previous,
	};
}
