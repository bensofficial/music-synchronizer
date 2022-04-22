import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function ToggleColorModeButton() {
	const { colorMode, toggleColorMode } = useColorMode();

	const ColorModeIcon = colorMode === "light" ? MoonIcon : SunIcon;

	return (
		<IconButton
			aria-label={`Toggle ${
				colorMode === "light" ? "dark" : "light"
			} mode`}
			icon={<ColorModeIcon />}
			isRound
			size="lg"
			pos="fixed"
			bottom="0"
			right="0"
			transform="translate(-50%,-50%)"
			zIndex={9}
			onClick={toggleColorMode}></IconButton>
	);
}
