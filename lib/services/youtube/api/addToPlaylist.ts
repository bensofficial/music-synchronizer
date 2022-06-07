import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";

export default async function addToPlaylist(
	user: User,
	playlistId: string,
	videoId: string,
) {
	authorizeUser(user);

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
