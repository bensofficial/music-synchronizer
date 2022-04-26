import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function ServiceCardWrapper(props: PropsWithChildren<BoxProps>) {
	return (
		<Box
			{...props}
			_hover={{
				boxShadow: "xl",
				cursor: "pointer",
			}}
			borderWidth="2px"
			borderRadius="lg"
		/>
	);
}
