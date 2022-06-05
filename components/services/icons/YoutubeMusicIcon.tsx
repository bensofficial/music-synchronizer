import { Icon, IconProps } from "@chakra-ui/react";
import { SiYoutubemusic } from "react-icons/si";

export default function YoutubeMusicIcon(props: IconProps) {
	return (
		<Icon
			w="full"
			h="full"
			{...props}
			color="brand.youtubeRed"
			as={SiYoutubemusic}
		/>
	);
}
