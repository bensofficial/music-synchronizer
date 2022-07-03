import Service from "../types";
import { addToPlaylist } from "./api/addToPlaylist";
import createPlaylist from "./api/createPlaylist";
import deleteFromPlaylist from "./api/deleteFromPlaylist";
import getPlaylist from "./api/getPlaylist";
import getPlaylistId from "./api/getPlaylistId";
import getSongId from "./api/getSongId";
import getSongsInPlaylist from "./api/getSongsInPlaylist";

const service: Service = {
	name: "spotify",
	songIdName: "spotifyId",
	getSongId: getSongId,
	getPlaylistId: getPlaylistId,
	getPlaylist: getPlaylist,
	getSongsInPlaylist: getSongsInPlaylist,
	addToPlaylist: addToPlaylist,
	deleteFromPlaylist: deleteFromPlaylist,
	createPlaylist: createPlaylist,
};

export default service;
