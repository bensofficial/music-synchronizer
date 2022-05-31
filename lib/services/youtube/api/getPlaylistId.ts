import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
//TODO
export default async function getPlaylistId(user: User, name: string) {
	const error = authorizeUser(user);
	if (error) {
		return error;
	}

	const youtube = google.youtube("v3");
}
