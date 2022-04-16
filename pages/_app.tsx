import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import ToggleColorModeButton from "$app/colormode/ToggleColorModeButton";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider>
			<Component {...pageProps} />
			<ToggleColorModeButton />
		</ChakraProvider>
	);
}

export default MyApp;
