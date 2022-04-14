import Script from "next/script";
import { useEffect } from "react";

/*
This loads the google Api (gapi) and loads the oauth2 script.
After this component is rendered, gapi as well as gapi.client and gapi.auth2 can be called anywhere in the app
using gapi the client can connect his google account.
*/

export default function LoadGoogleApi() {
	//call prepareGapi() when the component is first rendered
	useEffect(() => {
		prepareGapi();
	}, []);

	return (
		<Script
			src="https://apis.google.com/js/api.js"
			//load before the page loads
			strategy="beforeInteractive"
		/>
	);
}

function prepareGapi() {
	//adds the .auth2 property to gapi
	gapi.load(
		"client:auth2",
		/*callback for when the load finishes*/ async () => {
			await gapi.auth2.init({
				client_id:
					"323473282193-jdvhesk2u573kt3dot0jmkk42a6gn0c2.apps.googleusercontent.com",
			});
			gapi.client.setApiKey("AIzaSyBsKGY49NrhKc4En8UNMrqxWAlPzzBM3s0");
		},
	);
}
