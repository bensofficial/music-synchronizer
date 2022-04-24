import {Button, Link} from "@chakra-ui/react";
import {BsSpotify} from "react-icons/bs";

export default function AuthWithSpotifyButton() {

    return (
        <Link href="/api/spotify/login" textDecoration={"none"}>
            <Button leftIcon={<BsSpotify/>} textColor={"brand.spotifyBlack"} backgroundColor={"brand.spotifyGreen"} size={"lg"} _hover={{backgroundColor: "#54e888"}}>
                Connect with Spotify
            </Button>
        </Link>
    )
}
