import { Playlist } from "$lib/services/types";
import { User } from "@prisma/client";
import { google, youtube_v3 } from "googleapis";
import { authorizeUser } from "../authServer";
import { youtubePlaylistToPlaylist } from "./convert";

// Quota cost: 1 - ?

export async function getAllPlaylists(user: User): Promise<Playlist[]> {
	let playlists: Playlist[] = [];
	let nextPageToken: string | null | undefined = null;

	do {
		const result: PlaylistBatchResult = await getPlaylistBatch(
			user,
			nextPageToken,
		);

		nextPageToken = result.nextPageToken;
		playlists = playlists.concat(result.playlists);
	} while (nextPageToken != null);

	return playlists;
}

interface PlaylistBatchResult {
	playlists: Playlist[];
	nextPageToken: string | null | undefined;
	prevPageToken: string | null | undefined;
}

async function getPlaylistBatch(
	user: User,
	pageToken: string | null | undefined,
): Promise<PlaylistBatchResult> {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	const parameters: youtube_v3.Params$Resource$Playlists$List = {
		mine: true,
		part: ["snippet", "status"],
		maxResults: 50,
	};

	if (pageToken) {
		parameters.pageToken = pageToken;
	}

	const res = await youtube.playlists.list(parameters);

	let playlists: (Playlist | null)[] = [];

	if (res.data.items) {
		playlists = res.data.items.map((playlist) =>
			youtubePlaylistToPlaylist(playlist),
		);
	}

	return {
		playlists: playlists.filter((p) => p != null) as Playlist[],
		nextPageToken: res.data.nextPageToken,
		prevPageToken: res.data.prevPageToken,
	};
}
