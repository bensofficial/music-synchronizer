import { ServiceName } from "./types";
import spotify from "./spotify";
import youtube from "./youtube";

export default function getService(name: ServiceName) {
	switch (name) {
		case "spotify":
			return spotify;
		case "youtube":
			return youtube;
	}
}
