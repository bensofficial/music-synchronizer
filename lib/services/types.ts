import { User } from "@prisma/client";

export enum PlaylistType {
	private,
	public,
}

export interface Playlist {
	serviceId: string;
	title: string;
	type: PlaylistType;
}
export interface Song {
	title: string;
	artist: string;
	serviceId: string;
}

export type DisplayPlaylist = Playlist & {
	lastSynchronized: Date | null;
};

export type DisplayPlaylistFrontend = Playlist & {
	lastSynchronized: string | null;
};

export type ServiceName = "spotify" | "youtube";

export type SongIdName = `${ServiceName}Id`;

export default interface Service {
	name: ServiceName;
	songIdName: SongIdName;
	getSongId: (
		user: User,
		name: string,
		artist: string,
	) => Promise<string | null>;
	// return null if the playlist doesn't exist
	getPlaylistId: (user: User, name: string) => Promise<string | null>;
	// return null if the playlist doesn't exist
	getPlaylist: (user: User, playlistId: string) => Promise<Playlist | null>;
	getSongsInPlaylist: (user: User, playlistId: string) => Promise<Song[]>;
	addToPlaylist: (
		user: User,
		playlistId: string,
		songIds: string[],
	) => Promise<void>;
	deleteFromPlaylist: (
		user: User,
		playlistId: string,
		songIds: string[],
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
