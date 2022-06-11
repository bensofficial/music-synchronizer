import {Playlist, PlaylistType} from "$lib/services/types";

export function spotifyPlaylistsToPlaylists(json: any): Playlist[] {

    let playlists: Playlist[] = [];

    for(let i = 0; i < json.length; i++) {
        let obj = spotifyPlaylistToPlaylist(json[i]);
        playlists.push(obj)
    }

    return playlists;
}

export function spotifyPlaylistToPlaylist(json: any): Playlist {

    return {
        creator: json.owner.display_name,
        id: json.id,
        title: json.name,
        type: json.public ? PlaylistType.public : PlaylistType.private,
    }
}
