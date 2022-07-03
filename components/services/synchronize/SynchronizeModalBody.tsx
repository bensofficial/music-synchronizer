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
import { useState } from "react";
import SelectService from "./SelectService";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { UserWithoutDatesAndPassword } from "$types/user";
import SelectPlaylist from "./SelectPlaylist";
import SynchronizePlaylist from "./SynchronizePlaylist";

export default function SynchronizeModalBody({
	originService,
	playlist,
	user,
}: {
	user: UserWithoutDatesAndPassword;
	originService: ServiceName;
	playlist: Playlist;
}) {
	const [service, setService] = useState<ServiceName | null>(null);
	const [tabIndex, setTabIndex] = useState(0);
	const [playlistId, setPlaylistId] = useState<string | null>(null);

	const tabs = (
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
							user={user}
							originService={originService}
							service={service}
							setService={setService}
						/>
					</TabPanel>
					<TabPanel>
						{service && (
							<SelectPlaylist
								playlistId={playlistId}
								setPlaylistId={setPlaylistId}
								playlist={playlist}
								destinationService={service}
							/>
						)}
					</TabPanel>
				</TabPanels>
			</Tabs>
			<Center>
				<IconButton
					borderRadius="full"
					aria-label="previous page"
					icon={<FiArrowLeft />}
					disabled={tabIndex == 0}
					onClick={() => {
						setTabIndex(tabIndex - 1);
					}}
				/>
				<IconButton
					ml={4}
					borderRadius="full"
					aria-label="next page"
					icon={<FiArrowRight />}
					disabled={
						(tabIndex == 1 && playlistId == null) || service == null
					}
					onClick={() => {
						setTabIndex(tabIndex + 1);
					}}
				/>
			</Center>
		</>
	);

	return (
		<>
			{service && playlistId && tabIndex == 2 ? (
				<SynchronizePlaylist
					originService={originService}
					destService={service}
					destPlaylistId={playlistId}
					originPlaylistId={playlist.serviceId}
				/>
			) : (
				tabs
			)}
		</>
	);
}
