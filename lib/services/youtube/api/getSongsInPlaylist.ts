import { Song } from "$lib/services/types";
import { User } from "@prisma/client";
import { google, youtube_v3 } from "googleapis";
import { authorizeUser } from "../authServer";
import { youtubeSongToSong } from "./convert";

// Quota cost: 1 - ?

export async function getSongsInPlaylist(
	user: User,
	playlistId: string,
): Promise<Song[]> {
	let songs: Song[] = [];
	let nextPageToken: string | null | undefined = null;

	do {
		const result: SongBatchResult = await getSongBatch(
			user,
			playlistId,
			nextPageToken,
		);

		nextPageToken = result.nextPageToken;
		songs = songs.concat(result.songs);
	} while (nextPageToken != null);

	return songs;
}

interface SongBatchResult {
	songs: Song[];
	nextPageToken: string | null | undefined;
	prevPageToken: string | null | undefined;
}

async function getSongBatch(
	user: User,
	playlistId: string,
	pageToken: string | null | undefined,
): Promise<SongBatchResult> {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	const parameters: youtube_v3.Params$Resource$Playlistitems$List = {
		part: ["snippet"],
		playlistId: playlistId,
		maxResults: 50,
	};

	if (pageToken) {
		parameters.pageToken = pageToken;
	}

	const res = await youtube.playlistItems.list(parameters);

	let songs: (Song | null)[] = [];

	if (res.data.items) {
		songs = res.data.items.map((song) => youtubeSongToSong(song));
	}

	return {
		songs: songs.filter((s) => s != null) as Song[],
		nextPageToken: res.data.nextPageToken,
		prevPageToken: res.data.prevPageToken,
	};
}
