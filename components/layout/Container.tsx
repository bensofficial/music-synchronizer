import { Box, ChakraProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function Container(props: PropsWithChildren<ChakraProps>) {
	return (
		<Box
			px={{ base: "5%", sm: "5%", md: "10%", xl: "10%", "2xl": "15%" }}
			{...props}
		/>
	);
}
