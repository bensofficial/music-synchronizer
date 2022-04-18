import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import ToggleColorModeButton from "$app/colormode/ToggleColorModeButton";
import theme from "$app/theme";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
			<ToggleColorModeButton />
		</ChakraProvider>
	);
}

export default MyApp;
