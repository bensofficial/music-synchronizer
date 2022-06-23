import { ServiceName } from "./types";
import spotify from "./spotify";
import youtube from "./youtube";

export default function getService(name: ServiceName) {
	switch (name) {
		case "spotify":
			spotify;
		case "youtube":
			youtube;
	}
}
