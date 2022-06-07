import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
import getPlaylistWithSongs from "./getPlaylistWithSongs";

export default async function addToPlaylist(
	user: User,
	playlistId: string,
	videoId: string,
) {
	authorizeUser(user);

	const songsInPlaylist = await getPlaylistWithSongs(user, playlistId);
	if (songsInPlaylist instanceof Error) {
		return songsInPlaylist;
	}

	if (!songsInPlaylist.songs.find((song) => song.youtubeId === videoId)) {
		const youtube = google.youtube("v3");

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
}
