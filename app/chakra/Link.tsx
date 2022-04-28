import { LinkProps, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { PropsWithChildren } from "react";

export default function Link({
	href,
	children,
	...props
}: PropsWithChildren<Omit<LinkProps, "href"> & { href: string }>) {
	return (
		<NextLink href={href} passHref>
			<ChakraLink {...props}>{children}</ChakraLink>
		</NextLink>
	);
}
