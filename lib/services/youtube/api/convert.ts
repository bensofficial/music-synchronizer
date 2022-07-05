import { shortenLongSongTitle } from "$lib/services/convert";
import { Playlist, PlaylistType, Song } from "$lib/services/types";
import { youtube_v3 } from "googleapis";

export function youtubePlaylistToPlaylist(
	playlist: youtube_v3.Schema$Playlist,
): Playlist | null {
	if (
		!playlist.id ||
		!playlist.snippet?.title ||
		!playlist.status?.privacyStatus
	) {
		return null;
	}

	return {
		serviceId: playlist.id,
		title: playlist.snippet.title,
		type: privacyStatusToPlaylistType(playlist.status.privacyStatus!),
	};
}

export function youtubeSongToSong(
	song: youtube_v3.Schema$PlaylistItem,
): Song | null {
	if (
		!song.snippet?.resourceId?.videoId ||
		!song.snippet.title ||
		!song.snippet.videoOwnerChannelTitle
	) {
		return null;
	}

	return {
		serviceId: song.snippet.resourceId.videoId,
		title: shortenLongSongTitle(song.snippet.title),
		artist: normalizeYoutubeChannelTitle(
			song.snippet.videoOwnerChannelTitle,
		),
	};
}

/**
 * Removes the - Topic part of every youtube music channel name.
 * E.g: `tj_beastboy - Topic` becomes `tj_beastboy`
 */
function normalizeYoutubeChannelTitle(title: string) {
	if (/^.{1,}.{0,} (Topic)[ ]*$/gm.test(title)) {
		title = title.replace("Topic", "");
	}
	return title.replace("-", "").trim();
}

function privacyStatusToPlaylistType(privacyStatus: string): PlaylistType {
	if (privacyStatus === "public") {
		return PlaylistType.public;
	}
	return PlaylistType.private;
}
