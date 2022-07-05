export function isUserLoggedInWithGoogle(
	user: { youtubeRefreshToken: string | null } | null | undefined,
): boolean {
	return user != null && user.youtubeRefreshToken !== null;
}
