import { Playlist, PlaylistType, Song } from "$lib/services/types";
import { youtube_v3 } from "googleapis";

export function youtubePlaylistToPlaylist(
	playlist: youtube_v3.Schema$Playlist,
): Playlist | null {
	if (
		!playlist.id ||
		!playlist.snippet?.title ||
		!playlist.snippet.channelTitle ||
		!playlist.status?.privacyStatus
	) {
		return null;
	}

	return {
		serviceId: playlist.id,
		title: playlist.snippet.title,
		creator: playlist.snippet.channelTitle,
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
		title: song.snippet.title,
		artist: normalizeYoutubeChannelTitle(
			song.snippet.videoOwnerChannelTitle,
		),
	};
}

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
