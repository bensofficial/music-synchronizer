import { User } from "@prisma/client";
import { google } from "googleapis";

// Quota cost: 100

export default async function getSongId(
	_user: User,
	title: string,
	artist: string,
): Promise<string | null> {
	const youtube = google.youtube("v3");

	const res = await youtube.search.list({
		part: ["snippet"],
		q: `${title} ${artist}`,
		topicId: "/m/04rlf",
		maxResults: 1,
	});

	if (!res.data.items) {
		return null;
	}

	if (res.data.items[0].id && res.data.items[0].id.videoId) {
		return res.data.items[0].id.videoId;
	} else {
		throw new Error("Song is missing id property");
	}
}
