import { google } from "googleapis";

export default async function getSongId(
	title: string,
	artist: string,
): Promise<string | Error> {
	const youtube = google.youtube("v3");

	const res = await youtube.search.list({
		part: ["snippet"],
		q: `${title} ${artist}`,
		topicId: "/m/04rlf",
		maxResults: 1,
	});

	if (res.data.items) {
		if (res.data.items[0].id && res.data.items[0].id.videoId) {
			return res.data.items[0].id.videoId;
		} else {
			throw new Error("Song is missing id property");
		}
	} else {
		throw new Error("Song not found");
	}
}
