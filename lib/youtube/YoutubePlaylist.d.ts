export interface YoutubePlaylist {
	title: string;
	youtubeId: string;
	creator: string;
	type: "public" | "private" | "unlisted";
	length: number;
}
