import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";

export default async function createPlaylist(
	user: User,
	name: string,
): Promise<string> {
	authorizeUser(user);

	const youtube = google.youtube("v3");

	const res = await youtube.playlists.insert({
		part: ["snippet"],
		requestBody: {
			snippet: {
				title: name,
			},
		},
	});

	return res.data.id!;
}
