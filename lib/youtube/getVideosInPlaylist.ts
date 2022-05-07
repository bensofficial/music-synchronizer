import { YoutubeSong } from "./YoutubeSong";

export default async function getVideosInPlaylist(
	playlistId: string,
	maxResults: number,
): Promise<YoutubeSong[] | null> {
	const youtube = (gapi?.client as any)?.youtube;

	if (youtube) {
		try {
			const apiResponse = await youtube.playlistItems.list({
				part: ["snippet"],
				playlistId,
				maxResults,
			});
			const responseVideos = apiResponse.result.items;
			return responseVideos.map((video: any) => {
				return {
					title: video.snippet.title,
					author: video.snippet.videoOwnerChannelTitle,
					id: video.snippet.resourceId.videoId,
				};
			});
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	return null;
}
