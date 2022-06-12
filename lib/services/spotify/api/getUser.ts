import prisma from "$lib/prisma";
import { getRequest } from "$lib/services/spotify/request";
import { SessionUser } from "$lib/auth";

export async function getUser(
	sessionUser: SessionUser,
): Promise<{ error: boolean; errorMessage: string; responseData: any }> {
	const user = await prisma.user.findFirst({
		where: {
			id: sessionUser.id,
		},
	});

	if (!user) {
		throw new Error("No user found");
	}

	return await getRequest("https://api.spotify.com/v1/me", user);
}
