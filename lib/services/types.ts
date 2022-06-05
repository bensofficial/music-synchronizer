import { User } from "@prisma/client";

export enum PlaylistType {
	private,
	public,
}

export interface Playlist {
	serviceId: string;
	title: string;
	creator: string;
	type: PlaylistType;
}

export type PlaylistWithSongs = Playlist & {
	songs: Song[];
};

export interface Song {
	title: string;
	artist: string;
	serviceId: string;
}

export default interface Service {
	name: "spotify" | "youtube";
	songIdName: "spotifyId" | "youtubeId";
	getSongId: (name: string, artist: string) => Promise<string>;
	// return null if the playlist doesn't exist
	getPlaylistId: (user: User, name: string) => Promise<string | null>;
	getPlaylist: (user: User, playlistId: string) => Promise<Playlist>;
	getSongsInPlaylist: (user: User, playlistId: string) => Promise<Song[]>;
	addToPlaylist: (
		user: User,
		playlistId: string,
		videoId: string,
	) => Promise<void>;
	deleteFromPlaylist: (
		user: User,
		playlistId: string,
		videoId: string,
	) => Promise<void>;
	// should return the id of the newly created playlist
	createPlaylist: (user: User, name: string) => Promise<string>;
}

export function playlistTypeToString(type: PlaylistType): string {
	switch (type) {
		case PlaylistType.public:
			return "public";
		case PlaylistType.private:
			return "private";
	}
}
