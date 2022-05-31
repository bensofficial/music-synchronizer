import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";

export default async function deleteFromPlaylist(
	user: User,
	playlistId: string,
	videoId: string,
) {
	const err = authorizeUser(user);
	if (err) {
		return err;
	}

	const youtube = google.youtube("v3");

	try {
		await youtube.playlistItems.delete({
			id: `${playlistId}/${videoId}`,
		});
	} catch (e) {
		return e as Error;
	}
}
