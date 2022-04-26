import { Box, Button, ButtonProps, HStack, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function AddServiceButton({
	serviceName,
	children,
	...props
}: PropsWithChildren<ButtonProps & { serviceName: string }>) {
	return (
		<Button {...props} variant="outline" w="full">
			<HStack h="full">
				<Box w={5} h={5}>
					{children}
				</Box>
				<Text>{serviceName}</Text>
			</HStack>
		</Button>
	);
}
