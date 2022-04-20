import { Box, ChakraProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function Container(props: PropsWithChildren<ChakraProps>) {
	return <Box mx="15%" {...props} />;
}
