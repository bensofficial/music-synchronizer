import YoutubeMusicIcon from "$app/icons/YoutubeMusicIcon";
import DashboardLayout from "$app/layout/DashboardLayout";
import PlaylistTable from "$app/services/PlaylistTable";
import { Page } from "$types/next";
import {
	Heading,
	HStack,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";

const Index: Page = () => {
	return (
		<>
			<HStack gap={5}>
				<YoutubeMusicIcon h={16} w={16}></YoutubeMusicIcon>
				<Heading>Youtube Music</Heading>
			</HStack>
			<Tabs variant="soft-rounded" mt={8}>
				<TabList>
					<Tab>Playlists</Tab>
					<Tab>Songs</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<PlaylistTable
							playlist={[
								{
									title: "2022",
									creator: "You",
									type: "public",
								},
							]}></PlaylistTable>
					</TabPanel>
					<TabPanel>
						<p>Songs</p>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
