import { ChakraProvider } from "@chakra-ui/react";
import ToggleColorModeButton from "$app/colormode/ToggleColorModeButton";
import theme from "$app/theme";
import { AppProps } from "next/app";
import { Page } from "$types/next";
import { Fragment } from "react";

type Props = AppProps & {
	Component: Page;
};

function App({ Component, pageProps }: Props) {
	const Layout = Component.layout ?? Fragment;

	return (
		<ChakraProvider theme={theme}>
			<Layout>
				<Component {...pageProps}></Component>
			</Layout>
			<ToggleColorModeButton />
		</ChakraProvider>
	);
}

export default App;
