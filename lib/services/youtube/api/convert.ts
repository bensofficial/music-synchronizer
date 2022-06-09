import { Playlist, PlaylistType } from "$lib/services/types";
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

function privacyStatusToPlaylistType(privacyStatus: string): PlaylistType {
	if (privacyStatus === "public") {
		return PlaylistType.public;
	}
	return PlaylistType.private;
}
