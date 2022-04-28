export function userIsConnectedToSpotify(
	user:
		| {
				spotifyRefreshToken: string;
		  }
		| null
		| undefined,
): boolean {
	return user != null && user.spotifyRefreshToken.length > 0;
}
