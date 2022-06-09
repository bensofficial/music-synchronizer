import Link from "$components/chakra/Link";
import { Button } from "@chakra-ui/react";
import { SiYoutubemusic } from "react-icons/si";

export default function ConnectYoutubeButton({
	googleAuthUrl,
}: {
	googleAuthUrl: string;
}) {
	return (
		<Link href={googleAuthUrl} w="full" textDecoration={"none"}>
			<Button
				w="full"
				leftIcon={<SiYoutubemusic />}
				textColor="gray.900"
				_hover={{ backgroundColor: "brand.youtubeHover" }}
				backgroundColor="brand.youtubeRed">
				Connect with YoutubeMusic
			</Button>
		</Link>
	);
}
