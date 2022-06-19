import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";

// Quota cost per song: 50

export default async function addToPlaylist(
	user: User,
	playlistId: string,
	videoIds: string[],
) {
	for (let i = 0; i < videoIds.length; i += 1) {
		await addOneSongToPlaylist(user, playlistId, videoIds[i]);
	}
}

async function addOneSongToPlaylist(
	user: User,
	playlistId: string,
	songId: string,
) {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	await youtube.playlistItems.insert({
		requestBody: {
			snippet: {
				playlistId,
				resourceId: {
					kind: "youtube#video",
					videoId: songId,
				},
			},
		},
	});
}
