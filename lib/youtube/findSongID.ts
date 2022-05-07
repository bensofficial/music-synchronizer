interface Song {
	title: string;
	author: string;
}

export default async function findSongID(song: Song): Promise<string | null> {
	const youtube = (gapi?.client as any)?.youtube;

	if (youtube) {
		try {
			const apiResponse = await youtube.search.list({
				part: "snippet",
				q: `${song.title} ${song.author}`,
				maxResults: 1,
			});
			const responseSongs = apiResponse.result.items;
			const youtubeSong = responseSongs[0];
			if (youtubeSong) {
				return youtubeSong.id.videoId;
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	return null;
}
