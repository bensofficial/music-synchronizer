import { YoutubePlaylist } from "./YoutubePlaylist";

export default async function getPlaylists(): Promise<
	YoutubePlaylist[] | null
> {
	//ts doesn't recognise gapi.client.youtube
	const youtube = (gapi.client as any).youtube;

	//if this is false, then youtube wasn't loaded in
	//a loadGoogleApi component has to be rendered before this function is called
	//also the user has to
	if (youtube) {
		try {
			const apiResponse = await youtube.playlists.list({
				part: ["snippet", "status"],
				mine: true,
				maxResults: 50,
			});
			const responsePlaylists = apiResponse.result.items;

			const playlists = responsePlaylists.map((playlist: any) => {
				const snippet = playlist.snippet,
					status = playlist.status;

				return {
					title: snippet.title,
					id: playlist.id,
					creator: snippet.channelTitle,
					type: status.privacyStatus,
				};
			});

			return playlists;
		} catch (e) {
			console.error(e);
			return null;
		}
	} else {
		console.error(
			"youtube isn't loaded, this means that the user isn't connected with google",
		);
		return null;
	}
}
