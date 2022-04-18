import generateRandomString from "../../../lib/generateRandomString";
import Cookies from "js-cookie";
import {apiRequireAuth} from "$lib/auth";
import cookie from "cookie"

const clientId = process.env.SPOTIFY_CLIENT_ID
const redirectUri = process.env.SPOTIFY_REDIRECT_URI

const state = generateRandomString(16)
const scope = 'playlist-modify-public playlist-read-private playlist-modify-private'

export default apiRequireAuth((_req, res, _sessionUser) => {

    res.setHeader("Set-Cookie", cookie.serialize("spotify_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60,
        sameSite: "strict",
        path: "/"
    }))

    try {
        res.redirect(307, 'https://accounts.spotify.com/authorize?' +
            new URLSearchParams(`response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`)
        );

    } catch (err) {
        res.status(500).send({ error: 'failed to fetch data' })
    }
});



