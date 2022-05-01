//a loadGoogleApi component has to be rendered before calling this function
//otherwise gapi will not be defined

//a loadGoogleApi component has to be rendered before calling this function
//otherwise gapi will not be defined
export async function signInWithGoogle() {
	try {
		const googleAuthObject = await gapi.auth2?.getAuthInstance();
		await googleAuthObject.signIn({
			//scope = what will be allowed to access, in this case youtube
			scope: "https://www.googleapis.com/auth/youtube.force-ssl",
		});
	} catch (e) {
		console.error(e);
	}
}

export async function userIsLoggedInWithGoogle(): Promise<boolean> {
	try {
		const googleAuthObject = await gapi.auth2.getAuthInstance();

		return googleAuthObject.isSignedIn.get();
	} catch (e) {
		console.error(e);
	}
	return false;
}

//a loadGoogleApi component has to be rendered before calling this function
//otherwise gapi will not be defined

export async function ifNeededSignInWithGoogle() {
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
