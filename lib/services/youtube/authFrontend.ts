export function userIsLoggedInWithGoogle(
	user: { youtubeRefreshToken: string } | null | undefined,
): boolean {
	return user != null && user.youtubeRefreshToken.length > 0;
}
