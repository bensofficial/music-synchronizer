import { signInWithGoogle } from "$lib/youtube/auth";
import { Button } from "@chakra-ui/react";
import { SiYoutubemusic } from "react-icons/si";

export default function ConnectYoutubeButton() {
	return (
		<Button
			onClick={() => {
				signInWithGoogle();
			}}
			w="full"
			leftIcon={<SiYoutubemusic />}
			textColor="gray.900"
			_hover={{ backgroundColor: "red.400" }}
			backgroundColor="red.500">
			Connect with YoutubeMusic
		</Button>
	);
}
