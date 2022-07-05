import { shortenLongSongTitle } from "$lib/services/convert";
import { Playlist, PlaylistType } from "$lib/services/types";
import { SpotifyPlaylist, SpotifySong } from "../types";

export function spotifyPlaylistToPlaylist(playlist: SpotifyPlaylist): Playlist {
	return {
		serviceId: playlist.id,
		title: playlist.name,
		type: playlist.public ? PlaylistType.public : PlaylistType.private,
	};
}

export function spotifySongToSong(song: SpotifySong) {
	return {
		serviceId: song.id,
		title: shortenLongSongTitle(song.name),
		artist: song.artists[0].name,
	};
}
