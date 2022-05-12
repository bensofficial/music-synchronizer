export function userIsLoggedInWithSpotify(
	user:
		| {
				spotifyRefreshToken: string;
		  }
		| null
		| undefined,
): boolean {
	return user != null && user.spotifyRefreshToken.length > 0;
}