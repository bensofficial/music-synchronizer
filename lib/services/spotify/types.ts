export interface SpotifyPlaylist {
	owner: SpotifyUser;
	id: string;
	name: string;
	public: boolean;
}

export interface SpotifyUser {
	display_name: string;
	id: string;
}

export interface SpotifySong {
	id: string;
}
