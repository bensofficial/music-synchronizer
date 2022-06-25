export function isUserLoggedInWithSpotify(
	user:
		| {
				spotifyRefreshToken: string | null;
		  }
		| null
		| undefined,
): boolean {
	return user != null && user.spotifyRefreshToken !== null;
}
