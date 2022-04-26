import { Icon, IconProps } from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";

export default function SpotifyIcon(props: IconProps) {
	return (
		<Icon w="full" h="full" {...props} color="green.300" as={FaSpotify} />
	);
}
