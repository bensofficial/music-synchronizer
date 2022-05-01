import {
	extendTheme,
	withDefaultColorScheme,
	ThemeConfig,
	theme as baseTheme,
} from "@chakra-ui/react";

const config: ThemeConfig = {
	initialColorMode: "dark",
};
// See: https://chakra-ui.com/docs/styled-system/theming/customize-theme#using-theme-extensions
const colors = {
	brand: {
		...baseTheme.colors.blue,
		errorLight: baseTheme.colors.red[400],
		errorDark: baseTheme.colors.red[300],
		spotifyGreen: "#1DB954",
		spotifyHover: "#54e888",
		youtubeRed: "#FF0000",
		youtubeHover: baseTheme.colors.red[400],
	},
};

export default extendTheme(
	{ config, colors },
	withDefaultColorScheme({
		colorScheme: "brand",
	}),
) as {
	config: typeof config;
};
