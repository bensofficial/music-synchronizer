import { User } from "@prisma/client";
import { getAllPlaylists } from "./getPlaylists";

// Quota cost: 1 - ?

export default async function getPlaylistId(
	user: User,
	title: string,
): Promise<string | null> {
	const playlists = await getAllPlaylists(user);

	const playlist = playlists.find((p) => p.title === title);

	if (playlist) {
		return playlist.serviceId;
	} else {
		return null;
	}
}
