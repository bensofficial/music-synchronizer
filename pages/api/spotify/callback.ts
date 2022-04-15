import {NextApiRequest, NextApiResponse} from "next";
import * as queryString from "query-string";

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const redirectUri = process.env.SPOTIFY_REDIRECT_URI

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const code = req.query.code || null;
    const state = req.query.state || null;

    console.log(code)
    console.log(state)

    if (state === null) {
        res.redirect('/#' +
            new URLSearchParams('error=state_mismatch')
        )
    } else {
        const authOptions = {
            method: 'POST',
            body: queryString.stringify({
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
            headers: {
                'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            json: true
        };

        fetch('https://accounts.spotify.com/api/token', authOptions).then(async (response) => {
            const data = response.json();
            res.status(200).json(await data)
        })
    }
}
