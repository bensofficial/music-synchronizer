import { Playlist, ServiceName } from "$lib/services/types";
import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Center,
	IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SelectService from "./SelectService";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function SynchronizeModalBody({
	originService,
	playlist,
}: {
	originService: ServiceName;
	playlist: Playlist;
}) {
	const [service, setService] = useState<ServiceName | null>(null);
	const [tabIndex, setTabIndex] = useState(0);
	const [destinationPlaylist, setDestinationPlaylist] = useState<
		Playlist | "create"
	>("create");

	return (
		<>
			<Tabs index={tabIndex} align="center" isFitted variant="line">
				<TabList>
					<Tab
						onClick={() => {
							setTabIndex(0);
						}}>
						Select Service
					</Tab>
					<Tab
						onClick={() => {
							setTabIndex(1);
						}}
						isDisabled={service == null}>
						Select Playlist
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<SelectService
							originService={originService}
							service={service}
							setService={setService}
						/>
					</TabPanel>
					<TabPanel></TabPanel>
				</TabPanels>
			</Tabs>
			<Center>
				<IconButton
					borderRadius="full"
					aria-label="previous page"
					icon={<FiArrowLeft></FiArrowLeft>}
					disabled={tabIndex == 0}
					onClick={() => {
						setTabIndex(tabIndex - 1);
					}}
				/>
				<IconButton
					ml={4}
					borderRadius="full"
					aria-label="next page"
					icon={<FiArrowRight></FiArrowRight>}
					disabled={tabIndex == 1 || service == null}
					onClick={() => {
						setTabIndex(tabIndex + 1);
					}}
				/>
			</Center>
		</>
	);
}
