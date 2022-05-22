import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";

export default async function createPlaylist(user: User, name: string) {
	const err = authorizeUser(user);
	if (err) {
		return err;
	}

	const youtube = google.youtube("v3");

	try {
		const res = await youtube.playlists.insert({
			part: ["snippet"],
			requestBody: {
				snippet: {
					title: name,
				},
			},
		});
		return res.data.id;
	} catch (e) {
		return e as Error;
	}
}
