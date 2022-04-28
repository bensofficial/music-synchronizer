import { FaSpotify } from "react-icons/fa";
import Link from "$app/chakra/Link";
import { Button } from "@chakra-ui/react";

export default function ConnectSpotifyButton() {
	return (
		<Link href="/api/spotify/login" w="full" textDecoration={"none"}>
			<Button
				w="full"
				leftIcon={<FaSpotify />}
				textColor={"gray.900"}
				_hover={{ backgroundColor: "brand.spotifyHover" }}
				backgroundColor={"brand.spotifyGreen"}>
				Connect with Spotify
			</Button>
		</Link>
	);
}
