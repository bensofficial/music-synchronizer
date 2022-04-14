import LoadGoogleApi from "./loadGoogleApi";
import Image from "next/image";
import { useColorMode } from "@chakra-ui/react";

/*
When this button is clicked, the user will be propmpted to sign in with his google account.
After they signed in, gapi.client.youtube can be called anywhere in the app in order to access the youtube data api
and get the users personal data, like playlists.
 */

export default function GoogleLoginButton() {
	const { colorMode, setColorMode } = useColorMode(),
		btnImgPath =
			colorMode === "light"
				? "/btnGoogleSigninLight.png"
				: "/btnGoogleSigninDark.png";

	return (
		<>
			<LoadGoogleApi />
			<button onClick={() => connectClientGoogle()}>
				<Image src={btnImgPath} width={382} height={92} />
			</button>
		</>
	);
}

async function connectClientGoogle() {
	await signInClient();
	await loadClient();
}

async function signInClient() {
	try {
		const googleAuthObject = await gapi.auth2?.getAuthInstance();
		await googleAuthObject.signIn({
			//scope = what will be allowed to access, in this case youtube
			scope: "https://www.googleapis.com/auth/youtube.readonly",
		});
	} catch (e) {
		console.error(e);
	}
}
async function loadClient() {
	try {
		//loads in gapi.client.youtube
		await gapi.client?.load(
			"https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
			/*no idea what this parameter does but typescript insists*/ "insert funny joke here",
		);
	} catch (e) {
		console.error(e);
	}
}
