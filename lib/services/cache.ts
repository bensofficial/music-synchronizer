import prisma from "$lib/prisma";
import { SongIdMap, User } from "@prisma/client";
import Service, { Song } from "./types";

async function getSongIdMap(
	serviceSongId: string,
	service: Service,
): Promise<SongIdMap | null> {
	return await prisma.songIdMap.findUnique({
		where: {
			[service.songIdName]: serviceSongId,
		},
	});
}

async function updateSongIdMap(
	existingService: Service,
	existingSongId: string,
	newService: Service,
	newSongId: string,
) {
	await prisma.songIdMap.update({
		where: {
			[existingService.songIdName]: existingSongId,
		},
		data: {
			[newService.songIdName]: newSongId,
		},
	});
}

async function createSongIdMap(
	serviceOne: Service,
	serviceOneSongId: string,
	serviceTwo: Service,
	serviceTwoSongId: string,
) {
	await prisma.songIdMap.create({
		data: {
			[serviceOne.songIdName]: serviceOneSongId,
			[serviceTwo.songIdName]: serviceTwoSongId,
		},
	});
}

export default async function getSongIdForService(
	user: User,
	originSong: Song,
	originService: Service,
	destinationService: Service,
): Promise<string | null> {
	let songIdMap = await getSongIdMap(originSong.serviceId, originService);

	if (songIdMap && songIdMap[destinationService.songIdName]) {
		console.log("Song: ", originSong.title, " already in cache");

		return songIdMap[destinationService.songIdName]!;
	}

	const destinationSongId = await destinationService.getSongId(
		user,
		originSong.title,
		originSong.artist,
	);

	if (!destinationSongId) {
		return null;
	}

	let songIdMapDestination = await getSongIdMap(
		destinationSongId,
		destinationService,
	);

	if (
		songIdMapDestination &&
		songIdMapDestination[destinationService.songIdName]
	) {
		return songIdMapDestination[destinationService.songIdName]!;
	}

	if (songIdMap) {
		updateSongIdMap(
			originService,
			originSong.serviceId,
			destinationService,
			destinationSongId,
		);
		return destinationSongId;
	}

	console.log(
		"Song Map for: ",
		originSong.title,
		" does not exist yet, is being created",
	);

	createSongIdMap(
		originService,
		originSong.serviceId,
		destinationService,
		destinationSongId,
	);

	return destinationSongId;
}
