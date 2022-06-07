import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";

export default async function deleteFromPlaylist(
	user: User,
	playlistId: string,
	videoId: string,
) {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	try {
		const playlistItems = await youtube.playlistItems.list({
			part: ["snippet"],
			playlistId,
			videoId,
			maxResults: 1,
		});

		if (
			!playlistItems.data.items?.length ||
			!playlistItems.data.items[0].id
		) {
			return new Error("No song found");
		}

		const playlistItemId = playlistItems.data.items[0].id;

		await youtube.playlistItems.delete({
			id: playlistItemId,
		});
	} catch (e) {
		return e as Error;
	}
}
