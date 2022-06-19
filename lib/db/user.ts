import prisma from "$lib/prisma";

export async function getUserWithoutDatesAndPassword(userId: number) {
	return await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			id: true,
			email: true,
			username: true,
			spotifyAccessToken: true,
			spotifyRefreshToken: true,
			youtubeRefreshToken: true,
			spotifyUserId: true,
		},
	});
}
