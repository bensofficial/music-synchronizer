import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
import { youtubePlaylistToPlaylist } from "./convert";

export default async function getPlaylist(user: User, playlistId: string) {
	const error = authorizeUser(user);
	if (error) {
		return error;
	}

	const youtube = google.youtube("v3");

	try {
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
			return new Error("Playlist not found");
		}
	} catch (e) {
		return e as Error;
	}
}
