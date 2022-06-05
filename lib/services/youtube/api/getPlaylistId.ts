import { User } from "@prisma/client";
import { google } from "googleapis";
import { authorizeUser } from "../authServer";
import { getAllPlaylists } from "./getPlaylists";
//TODO
export default async function getPlaylistId(user: User, title: string) {
	const playlists = await getAllPlaylists(user);

	if (playlists instanceof Array) {
		const playlist = playlists.find((p) => p.title === title);

		if (playlist) {
			return playlist.id;
		} else {
			return new Error("No playlist with that title");
		}
	} else {
		return playlists;
	}
}
