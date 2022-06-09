import { Playlist } from "$lib/services/types";
import { User } from "@prisma/client";
import { google, youtube_v3 } from "googleapis";
import { authorizeUser } from "../authServer";
import { youtubePlaylistToPlaylist } from "./convert";

export async function getAllPlaylists(user: User): Promise<Playlist[]> {
	let playlists: Playlist[] = [];
	let nextPageToken: string | null | undefined = null;

	do {
		const result: PlaylistBatchResult = await getPlaylistBatch(
			user,
			50,
			nextPageToken,
		);

		nextPageToken = result.nextPageToken;
		playlists = playlists.concat(result.playlists);
	} while (nextPageToken != null);

	return playlists;
}

type PlaylistBatchResult = {
	playlists: Playlist[];
	nextPageToken: string | null | undefined;
	prevPageToken: string | null | undefined;
	numberOfPages: number;
};

export async function getPlaylistBatch(
	user: User,
	maxResults: number = 50,
	pageToken: string | null | undefined = null,
): Promise<PlaylistBatchResult> {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	const parameters: youtube_v3.Params$Resource$Playlists$List = {
		mine: true,
		part: ["snippet", "status"],
		maxResults,
	};

	if (pageToken) {
		parameters.pageToken = pageToken;
	}

	const res = await youtube.playlists.list(parameters);

	let playlists: Playlist[] = [];

	if (res.data.items) {
		playlists = res.data.items.map((playlist) =>
			youtubePlaylistToPlaylist(playlist),
		);
	}

	return {
		playlists,
		nextPageToken: res.data.nextPageToken,
		prevPageToken: res.data.prevPageToken,
		numberOfPages: Math.ceil(
			res.data.pageInfo!.totalResults! /
				res.data.pageInfo!.resultsPerPage!,
		),
	};
}
