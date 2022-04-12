import { Center, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import YoutubeAuth from "./api/youtube-auth";


const Home: NextPage = () => {
	return (<>
		<Center h="100vh">
			<Heading>👋 Hello!</Heading>
			<YoutubeAuth />
		</Center>
	</>
	);
};

export default Home;