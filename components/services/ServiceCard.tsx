import {
	Box,
	BoxProps,
	ChakraProps,
	Flex,
	Heading,
	HStack,
	Icon,
	Tag,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { IconType } from "react-icons";
import ServiceCardWrapper from "./ServiceCardWrapper";

export default function ServiceCard({
	href,
	serviceName,
	children,
	...props
}: PropsWithChildren<
	BoxProps & {
		href: string;
		serviceName: string;
	}
>) {
	const router = useRouter();

	return (
		<ServiceCardWrapper {...props}>
			<Flex
				justifyContent="space-between"
				onClick={() => {
					router.push(href);
				}}
				gap={10}
				w="full"
				flexWrap="wrap"
				p={5}>
				<Box mr={5} h={16} w={16}>
					{children}
				</Box>
				<VStack align="end">
					<Tag fontWeight="bold">Service</Tag>
					<Heading>{serviceName}</Heading>
				</VStack>
			</Flex>
		</ServiceCardWrapper>
	);
}
