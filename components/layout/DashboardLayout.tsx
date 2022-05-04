import { PropsWithChildren } from "react";
import Container from "./Container";
import DashboardNav from "./DashboardNav";

export default function DashboardLayout({
	children,
}: PropsWithChildren<Record<string, never>>) {
	return (
		<>
			<Container mb={4} borderBottomWidth="2px">
				<DashboardNav />
			</Container>
			<Container>{children}</Container>
		</>
	);
}
