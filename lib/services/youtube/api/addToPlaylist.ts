import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
import getPlaylistWithSongs from "./getPlaylistWithSongs";

export default async function addToPlaylist(
	user: User,
	playlistId: string,
	videoId: string,
) {
	const err = authorizeUser(user);
	if (err) {
		return err;
	}

	const songsInPlaylist = await getPlaylistWithSongs(user, playlistId);
	if (songsInPlaylist instanceof Error) {
		return songsInPlaylist;
	}

	if (!songsInPlaylist.songs.find((song) => song.youtubeId === videoId)) {
		const youtube = google.youtube("v3");

		try {
			await youtube.playlistItems.insert({
				part: ["snippet"],
				requestBody: {
					snippet: {
						playlistId,
						resourceId: {
							kind: "youtube#video",
							videoId,
						},
					},
				},
			});
		} catch (e) {
			return e as Error;
		}
	} else {
		return new Error("Song already in playlist");
	}
}
