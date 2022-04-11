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
