import Link from "$app/chakra/Link";
import { Button, ButtonProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function LinkButton({
	href,
	...props
}: PropsWithChildren<ButtonProps> & {
	href: string;
}) {
	return (
		<Link href={href} textDecoration="none">
			<Button {...props} />
		</Link>
	);
}
