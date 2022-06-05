import {
	Button,
	ButtonProps,
	IconButton,
	IconButtonProps,
	useColorModeValue,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function SelectServiceButton({
	selected,
	...props
}: PropsWithChildren<ButtonProps> & {
	selected: Boolean;
}) {
	return (
		<Button
			borderColor={useColorModeValue("brand.400", "brand.500")}
			borderWidth={selected ? "2px" : "0px"}
			borderRadius="full"
			colorScheme="gray"
			{...props}
			w={20}
			h={20}></Button>
	);
}
