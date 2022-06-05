import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
//TODO
export default async function getPlaylistId(user: User, name: string) {
	authorizeUser(user);

	const youtube = google.youtube("v3");
}
