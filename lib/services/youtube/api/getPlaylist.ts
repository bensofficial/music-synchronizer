import { Playlist } from "$lib/services/types";
import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
import { youtubePlaylistToPlaylist } from "./convert";

// Quota cost: 1

export default async function getPlaylist(
	user: User,
	playlistId: string,
): Promise<Playlist | null> {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	const res = await youtube.playlists.list({
		id: [playlistId],
		part: ["snippet", "status"],
		maxResults: 1,
	});

	if (res.data.items) {
		const youtubePlaylist = res.data.items[0],
			playlist = youtubePlaylistToPlaylist(youtubePlaylist);

		return playlist;
	} else {
		return null;
	}
}
