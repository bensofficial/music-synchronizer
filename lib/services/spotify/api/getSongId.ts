import { User } from "@prisma/client";
import { getRequest } from "../request";
import { SpotifySong } from "../types";
export default async function getSongId(
	user: User,
	title: string,
	artist: string,
): Promise<string | null> {
	const { resData, error, errorMessage } = await getRequest<{
		tracks: {
			items: SpotifySong[];
		};
	}>(
		`https://api.spotify.com/v1/search?type=track&limit=1&q=${title} ${artist}`,
		user,
	);

	if (!resData || error) {
		throw new Error(errorMessage);
	}

	if (resData.tracks.items.length === 0) {
		return null;
	}

	return resData.tracks.items[0].id;
}
