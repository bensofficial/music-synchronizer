import { Playlist, PlaylistType, Song } from "$lib/services/types";
import { youtube_v3 } from "googleapis";

export function youtubePlaylistToPlaylist(
	playlist: youtube_v3.Schema$Playlist,
): Playlist {
	const snippet = playlist.snippet!;

	return {
		serviceId: playlist.id!,
		title: snippet.title!,
		creator: snippet.channelTitle!,
		type: privacyStatusToPlaylistType(playlist.status!.privacyStatus!),
	};
}

export function youtubeSongToSong(song: youtube_v3.Schema$PlaylistItem): Song {
	return {
		serviceId: song.snippet!.resourceId!.videoId!,
		title: song.snippet!.title!,
		artist: song.snippet!.videoOwnerChannelTitle!,
	};
}

function privacyStatusToPlaylistType(privacyStatus: string): PlaylistType {
	if (privacyStatus === "public") {
		return PlaylistType.public;
	}
	return PlaylistType.private;
}
