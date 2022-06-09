import { Playlist } from "$lib/services/types";
import {
	BoxProps,
	HStack,
	Icon,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiEdit3, FiPlusCircle } from "react-icons/fi";

export default function SelectPlaylistButton({
	playlist,
	selected,
	...props
}: BoxProps & {
	selected: boolean;
	playlist: Playlist | null;
}) {
	const icon = playlist ? FiEdit3 : FiPlusCircle;

	const borderColor = useColorModeValue("gray.500", "gray.400");
	const backgroundColor = useColorModeValue("gray.200", "gray.600");

	return (
		<HStack
			{...props}
			justifyContent="space-between"
			w="full"
			backgroundColor={selected ? backgroundColor : "transparent"}
			borderStyle={selected ? "solid" : "dashed"}
			borderWidth="2px"
			_hover={{ cursor: "pointer" }}
			padding="4"
			borderRadius="xl"
			borderColor={selected ? "brand.500" : borderColor}>
			<Icon w={7} h={7} as={icon} />
			<Text fontSize="larger" fontWeight="semibold">
				{playlist ? `Edit existing playlist` : "Create new playlist"}
			</Text>
		</HStack>
	);
}
