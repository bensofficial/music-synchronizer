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
	title: string;
	creator: string;
	type: PlaylistType;
}

export type PlaylistWithSongs = Playlist & {
	songs: Song[];
};

export interface Service {
	getSong: (name: string) => Promise<Song | Error>;
	getPlaylistId: (user: User, name: string) => Promise<string | Error>;
	getPlaylist: (user: User, playlistId: string) => Promise<Playlist | Error>;
	getPlaylists: (user: User) => Promise<Playlist[] | Error>;
	getPlaylistWithSongs: (
		user: User,
		playlistId: string,
	) => Promise<PlaylistWithSongs | Error>;
	addToPlaylist: (user: User, playlistId: string) => Promise<void | Error>;
	deleteFromPlaylist: (
		user: User,
		playlistId: string,
	) => Promise<void | Error>;
	createPlaylist: (name: string) => Promise<void | Error>;
}
