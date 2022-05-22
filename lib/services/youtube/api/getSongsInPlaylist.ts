import { Song } from "$lib/services/types";
import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";

export default async function getSongsInPlaylist(
	playlistId: string,
	playlistLength: number,
	user: User,
): Promise<Song[] | Error> {
	const error = authorizeUser(user);
	if (error) {
		return error;
	}

	const youtube = google.youtube("v3");

	try {
		const res = await youtube.playlistItems.list({
			part: ["snippet"],
			playlistId: playlistId,
			maxResults: playlistLength,
		});

		let songs: ({
			youtubeId: string;
			title: string;
			artist: string;
		} | null)[] = [];

		if (res.data.items) {
			songs = res.data.items.map((song) => {
				if (song.snippet?.resourceId) {
					const youtubeId = song.snippet.resourceId.videoId,
						title = song.snippet.title,
						artist = song.snippet.channelTitle;

					if (youtubeId && title && artist) {
						return { youtubeId, title, artist };
					}
				}
				return null;
			});
		}

		return songs.filter((song) => song) as Song[];
	} catch (e) {
		return e as Error;
	}
}
