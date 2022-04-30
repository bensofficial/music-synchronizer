//a loadGoogleApi component has to be rendered before calling this function
//otherwise gapi will not be defined

export default async function signInWithGoogle() {
	try {
		const googleAuthObject = await gapi.auth2?.getAuthInstance();

		if (!googleAuthObject.isSignedIn.get()) {
			await googleAuthObject.signIn({
				//scope = what will be allowed to access, in this case youtube
				scope: "https://www.googleapis.com/auth/youtube.force-ssl",
			});
		}
	} catch (e) {
		console.error(e);
	}
}
