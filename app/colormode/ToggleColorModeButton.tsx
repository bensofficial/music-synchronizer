import {
	Icon,
	IconButton,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ToggleColorModeButton() {
	const { colorMode, toggleColorMode } = useColorMode();

	const ColorModeIcon = colorMode === "light" ? FiMoon : FiSun;

	return (
		<IconButton
			aria-label={`Toggle ${
				colorMode === "light" ? "dark" : "light"
			} mode`}
			icon={<Icon as={ColorModeIcon} />}
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
