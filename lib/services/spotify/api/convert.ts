import { Playlist, PlaylistType } from "$lib/services/types";
import { SpotifyPlaylist } from "../types";

export function spotifyPlaylistsToPlaylists(
	spotifyPlaylists: SpotifyPlaylist[],
): Playlist[] {
	return spotifyPlaylists.map((playlist) =>
		spotifyPlaylistToPlaylist(playlist),
	);
}

export function spotifyPlaylistToPlaylist(playlist: SpotifyPlaylist): Playlist {
	return {
		creator: playlist.owner.display_name,
		serviceId: playlist.id,
		title: playlist.name,
		type: playlist.public ? PlaylistType.public : PlaylistType.private,
	};
}
