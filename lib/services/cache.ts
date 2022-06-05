import prisma from "$lib/prisma";
import { SongIdMap } from "@prisma/client";
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
	originSong: Song,
	originService: Service,
	destinationService: Service,
): Promise<string> {
	let songIdMap = await getSongIdMap(originSong.serviceId, originService);

	if (songIdMap && songIdMap[destinationService.songIdName]) {
		return songIdMap[destinationService.songIdName]!;
	}

	const destinationSongId = await destinationService.getSongId(
		originSong.title,
		originSong.artist,
	);

	if (songIdMap) {
		updateSongIdMap(
			originService,
			originSong.serviceId,
			destinationService,
			destinationSongId,
		);
		return destinationSongId;
	}

	createSongIdMap(
		originService,
		originSong.serviceId,
		destinationService,
		destinationSongId,
	);

	return destinationSongId;
}
