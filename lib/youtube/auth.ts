//a loadGoogleApi component has to be rendered before calling this function
//otherwise gapi will not be defined
import { useEffect, useState } from "react";

export async function signInWithGoogle() {
	try {
		const googleAuthObject = await gapi.auth2.getAuthInstance();

		await googleAuthObject.signIn({
			//scope = what will be allowed to access, in this case youtube
			scope: "https://www.googleapis.com/auth/youtube.force-ssl",
		});
	} catch (e) {
		console.error(e);
	}
}

export function useUserIsConnectedToYoutube(): boolean {
	const [connected, setConnected] = useState(false);
	const [sent, setSent] = useState(false);

	const getConnected = async () => {
		const googleAuthObject = await gapi.auth2.getAuthInstance();
		console.log("noice updating some shit");
		setConnected(googleAuthObject.isSignedIn.get());
	};

	if (typeof gapi !== "undefined" && gapi.auth2 && !sent) {
		setSent(true);
		getConnected();
	}

	return connected;
}
