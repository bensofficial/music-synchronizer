import { PlaylistWithSongs } from "$lib/services/types";
import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
import { youtubePlaylistToPlaylist } from "./convert";
import getSongsInPlaylist from "./getSongsInPlaylist";

export default async function getPlaylistWithSongs(
	user: User,
	playlistId: string,
) {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	const res = await youtube.playlists.list({
		id: [playlistId],
		part: ["snippet", "status"],
		maxResults: 1,
	});

	if (res.data.items) {
		const youtubePlaylist = res.data.items[0];

		if (youtubePlaylist.id && youtubePlaylist.contentDetails?.itemCount) {
			const playlist: PlaylistWithSongs = {
				...youtubePlaylistToPlaylist(youtubePlaylist),
				songs: [],
			};
			const songs = await getSongsInPlaylist(
				playlistId,
				youtubePlaylist.contentDetails.itemCount,
				user,
			);

			if (!(songs instanceof Error)) {
				playlist.songs = songs;
			}

			return playlist;
		}
	}

	throw new Error("Playlist not found");
}
