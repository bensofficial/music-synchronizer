import { getRequest } from "$lib/serverRequest";
import { SpotifySong } from "../types";
export default async function getSongId(
	title: string,
	artist: string,
): Promise<string> {
	const { resData, error, errorMessage } = await getRequest<{
		tracks: {
			items: SpotifySong[];
		};
	}>(
		`https://api.spotify.com/v1/search?type=track&limit=1&q=${title} ${artist}`,
		{
			headers: { Authorization: "", "Content-Type": "application/json" },
		},
	);

	if (!resData || error) {
		throw new Error(errorMessage);
	}

	if (resData.tracks.items.length === 0) {
		throw new Error("Song not found");
	}

	return resData.tracks.items[0].id;
}
