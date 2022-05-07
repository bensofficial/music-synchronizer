import getVideosInPlaylist from "./getVideosInPlaylist";
import { YoutubeSong } from "./YoutubeSong";

export default async function insertSongInPlaylist(
	playlistId: string,
	playlistLength: number,
	songId: string,
): Promise<YoutubeSong | null> {
	const youtube = (gapi?.client as any)?.youtube;

	if (youtube) {
		try {
			const existingVideos = await getVideosInPlaylist(
				playlistId,
				playlistLength,
			);

			if (existingVideos) {
				const doublicateVideo = existingVideos.find(
					(video) => video.id === songId,
				);
				if (doublicateVideo) {
					return null;
				}
			}

			const apiResponse = await youtube.playlistItems.insert({
				part: ["snippet"],
				resource: {
					snippet: {
						playlistId,
						resourceId: {
							kind: "youtube#video",
							videoId: songId,
						},
					},
				},
			});
			const responseVideo = apiResponse.result;
			return {
				title: responseVideo.snippet.title,
				author: responseVideo.snippet.videoOwnerChannelTitle,
				id: responseVideo.snippet.resourceId.videoId,
			};
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	return null;
}
