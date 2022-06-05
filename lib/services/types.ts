import { User } from "@prisma/client";

export interface Song {
	youtubeId: string;
	spotifyId: string;
	title: string;
	artist: string;
}

export enum PlaylistType {
	private,
	public,
}

export interface Playlist {
	id: string;
	title: string;
	creator: string;
	type: PlaylistType;
}

export default interface Service {
	getSongId: (name: string, author: string) => Promise<string | Error>;
	getPlaylistId: (user: User, name: string) => Promise<string | Error>;
	getPlaylist: (user: User, playlistId: string) => Promise<Playlist | Error>;
	getSongsInPlaylist: (
		user: User,
		playlistId: string,
	) => Promise<Song[] | Error>;
	addToPlaylist: (
		user: User,
		playlistId: string,
		videoId: string,
	) => Promise<void | Error>;
	deleteFromPlaylist: (
		user: User,
		playlistId: string,
		videoId: string,
	) => Promise<void | Error>;
	createPlaylist: (user: User, name: string) => Promise<void | Error>;
}

export function playlistTypeToString(type: PlaylistType): string {
	switch (type) {
		case PlaylistType.public:
			return "public";
		case PlaylistType.private:
			return "private";
	}
}
