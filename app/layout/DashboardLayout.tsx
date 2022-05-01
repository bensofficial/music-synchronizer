import LoadGoogleApi from "$app/youtube/loadGoogleApi";
import { PropsWithChildren } from "react";
import Container from "./Container";
import DashboardNav from "./DashboardNav";

export default function DashboardLayout({
	children,
}: PropsWithChildren<Record<string, never>>) {
	return (
		<>
			<LoadGoogleApi />
			<Container mb={4} borderBottomWidth="2px">
				<DashboardNav />
			</Container>
			<Container>{children}</Container>
		</>
	);
}
