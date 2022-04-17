//In TypeScript geht das komischerweise nicht

import generateRandomString from "../../../lib/generateRandomString";
import {NextApiRequest, NextApiResponse} from "next";
import Cookies from "js-cookie";
import {apiRequireAuth} from "$lib/auth";

const clientId = process.env.SPOTIFY_CLIENT_ID
const redirectUri = process.env.SPOTIFY_REDIRECT_URI

const state = generateRandomString(16)
const scope = 'playlist-modify-public playlist-read-private playlist-modify-private'

export default apiRequireAuth((_req, res, _sessionUser) => {

    Cookies.set('spotify_state', state)
    console.log(state)

    try {
        res.redirect(307, 'https://accounts.spotify.com/authorize?' +
            new URLSearchParams(`response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`)
        );

    } catch (err) {
        res.status(500).send({ error: 'failed to fetch data' })
    }
});



