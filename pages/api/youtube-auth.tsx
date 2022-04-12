import Script from "next/script";

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({
            scope: "https://www.googleapis.com/auth/youtube.readonly"
        })
        .then(function () { console.log("Sign-in successful"); },
            function (err: any) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey("AIzaSyBsKGY49NrhKc4En8UNMrqxWAlPzzBM3s0");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest", "-100")
        .then(function () { console.log("GAPI client loaded for API"); },
            function (err: any) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    //typescript doesn't recognize .youtube
    return (gapi.client as any).youtube.playlistItems.list({
        "part": [
            "snippet,contentDetails"
        ],
        "maxResults": 25,
        "playlistId": "PLBCF2DAC6FFB574DE"
    })
        .then(function (response: any) {
            // Handle the results here (response.result has the parsed body).
            console.log(response);
        },
            function (err: any) { console.error("Execute error", err); });
}



function YoutubeAuth() {
    return <span>
        <Script src="https://apis.google.com/js/api.js" strategy="beforeInteractive"></Script>
        <Script
            id="load-gapi"
            dangerouslySetInnerHTML={{
                __html: `
                       gapi.load("client:auth2", function () {
                gapi.auth2.init({ client_id: "323473282193-jdvhesk2u573kt3dot0jmkk42a6gn0c2.apps.googleusercontent.com" });
});`,
            }}>


        </Script>
        <button onClick={() => authenticate().then(loadClient)}>authorize and load</button>
        <button onClick={() => execute()}>execute</button>
    </span>
}




export default YoutubeAuth;