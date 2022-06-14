import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";

// Quota cost per song: 51

export default async function deleteFromPlaylist(
	user: User,
	playlistId: string,
	songIds: string[],
) {
	for (let i = 0; i < songIds.length; i += 1) {
		await deleteOneSongFromPlaylist(user, playlistId, songIds[0]);
	}
}

async function deleteOneSongFromPlaylist(
	user: User,
	playlistId: string,
	songId: string,
): Promise<void> {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	const playlistItems = await youtube.playlistItems.list({
		part: ["snippet"],
		playlistId,
		videoId: songId,
		maxResults: 1,
	});

	if (!playlistItems.data.items?.length || !playlistItems.data.items[0].id) {
		throw new Error("No song found");
	}

	const playlistItemId = playlistItems.data.items[0].id;

	await youtube.playlistItems.delete({
		id: playlistItemId,
	});
}
