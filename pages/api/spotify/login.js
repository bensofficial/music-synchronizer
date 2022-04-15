//In TypeScript geht das komischerweise nicht

import generateRandomString from "../../../lib/generateRandomString";

const clientId = process.env.SPOTIFY_CLIENT_ID
const redirectUri = process.env.SPOTIFY_REDIRECT_URI

const state = generateRandomString(16)
const scope = 'playlist-modify-public playlist-read-private playlist-modify-private'

export default async function handler(req, res) {

    try {
        res.redirect(307, 'https://accounts.spotify.com/authorize?' +
            new URLSearchParams(`response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`)
        );
    } catch (err) {
        res.status(500).send({ error: 'failed to fetch data' })
    }
}


