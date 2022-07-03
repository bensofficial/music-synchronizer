import { getRequest } from "../request";
import { Song } from "$lib/services/types";
import { User } from "@prisma/client";
import { SpotifySong } from "../types";
import { spotifySongToSong } from "./convert";

export default async function getSongsInPlaylist(
	user: User,
	playlistId: string,
): Promise<Song[]> {
	let songs: Song[] = [];
	let nextPageUrl:
		| string
		| null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;

	do {
		const result: SongBatchResult = await getSongBatch(nextPageUrl, user);

		nextPageUrl = result.nextPageUrl;
		songs = songs.concat(result.songs);
	} while (nextPageUrl != null);

	return songs;
}

type SongBatchResult = {
	songs: Song[];
	nextPageUrl: string | null;
	prevPageUrl: string | null;
};

export async function getSongBatch(
	pageUrl: string,
	user: User,
): Promise<SongBatchResult> {
	const { resData, error, errorMessage } = await getRequest<{
		items: {
			track: SpotifySong;
		}[];
		next: string | null;
		previous: string | null;
	}>(pageUrl, user);

	if (error || !resData) {
		throw new Error(errorMessage);
	}

	const songs = resData.items.map((song) => spotifySongToSong(song.track));

	return {
		songs,
		nextPageUrl: resData.next,
		prevPageUrl: resData.previous,
	};
}
