import Container from "$app/layout/Container";
import DashboardNav from "$app/layout/DashboardNav";
import { LinkIcon } from "@chakra-ui/icons";
import {
	Heading,
	HStack,
	Image,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Center,
	Table,
	TableContainer,
	TableCaption,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Button,
} from "@chakra-ui/react";

export default function Index() {
	return (
		<>
			<DashboardNav />
			<Container py={5}>
				<HStack gap={5}>
					<Image
						h={14}
						w={14}
						alt="Spotify"
						src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
					/>
					<Heading>Spotify</Heading>
				</HStack>
				<Tabs variant="soft-rounded" mt={8}>
					<TabList>
						<Tab>Playlists</Tab>
						<Tab>Songs</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<TableContainer my={8}>
								<Table variant="simple">
									<TableCaption>
										All your spotify playlists
									</TableCaption>
									<Thead>
										<Tr>
											<Th>Title</Th>
											<Th>Creator</Th>
											<Th>Type</Th>
											<Th>Synchronize</Th>
										</Tr>
									</Thead>
									<Tbody>
										<Tr>
											<Td>2022</Td>
											<Td>You</Td>
											<Td>Private</Td>
											<Td>
												<Button
													size="sm"
													leftIcon={
														<LinkIcon></LinkIcon>
													}>
													Synchronize
												</Button>
											</Td>
										</Tr>
										<Tr>
											<Td>Ultimate Gaming Mix</Td>
											<Td>You</Td>
											<Td>Private</Td>
											<Td>
												<Button
													size="sm"
													leftIcon={
														<LinkIcon></LinkIcon>
													}>
													Synchronize
												</Button>
											</Td>
										</Tr>
										<Tr>
											<Td>Horizon Soundtracks</Td>
											<Td>Joris de Man</Td>
											<Td>Public</Td>
											<Td>
												<Button
													size="sm"
													leftIcon={
														<LinkIcon></LinkIcon>
													}>
													Synchronize
												</Button>
											</Td>
										</Tr>
									</Tbody>
								</Table>
							</TableContainer>
						</TabPanel>
						<TabPanel>
							<p>Songs</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Container>
		</>
	);
}
