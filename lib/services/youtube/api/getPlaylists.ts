import { Playlist } from "$lib/services/types";
import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
import { youtubePlaylistToPlaylist } from "./convert";

export default async function getPlaylists(
	user: User,
): Promise<Playlist[] | Error> {
	const error = authorizeUser(user);
	if (error) {
		return error;
	}

	const youtube = google.youtube("v3");

	try {
		const res = await youtube.playlists.list({
			mine: true,
			part: ["snippet", "status"],
			maxResults: 50,
		});

		let playlists: Playlist[] = [];

		if (res.data.items) {
			playlists = res.data.items.map((playlist) =>
				youtubePlaylistToPlaylist(playlist),
			);
		}

		return playlists;
	} catch (e) {
		return e as Error;
	}
}
