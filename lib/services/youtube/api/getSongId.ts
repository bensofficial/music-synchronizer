import { google } from "googleapis";

// Quota cost: 100

export default async function getSongId(
	title: string,
	artist: string,
): Promise<string> {
	const youtube = google.youtube("v3");

	const res = await youtube.search.list({
		part: ["snippet"],
		q: `${title} ${artist}`,
		topicId: "/m/04rlf",
		maxResults: 1,
	});

	if (!res.data.items) {
		throw new Error("Song not found");
	}

	if (res.data.items[0].id && res.data.items[0].id.videoId) {
		return res.data.items[0].id.videoId;
	} else {
		throw new Error("Song is missing id property");
	}
}
