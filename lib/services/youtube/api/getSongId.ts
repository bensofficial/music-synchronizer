import { google } from "googleapis";

export default async function getSongId(
	title: string,
	author: string,
): Promise<string | Error> {
	const youtube = google.youtube("v3");

	try {
		const res = await youtube.search.list({
			part: ["snippet"],
			q: `${title} ${author}`,
			topicId: "/m/04rlf",
			maxResults: 1,
		});

		if (res.data.items) {
			if (res.data.items[0].id && res.data.items[0].id.videoId) {
				return res.data.items[0].id.videoId;
			} else {
				return new Error("Song is missing id property");
			}
		} else {
			return new Error("Song not found");
		}
	} catch (e) {
		return e as Error;
	}
}
