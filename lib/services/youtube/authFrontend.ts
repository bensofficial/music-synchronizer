export function userIsLoggedInWithGoogle(
	user: { youtubeRefreshToken: string | null } | null | undefined,
): boolean {
	return user != null && user.youtubeRefreshToken !== null;
}
