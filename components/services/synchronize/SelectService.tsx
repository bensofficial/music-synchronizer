import { ServiceName } from "$lib/services/types";
import { Box, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import SpotifyIcon from "../icons/SpotifyIcon";
import YoutubeMusicIcon from "../icons/YoutubeMusicIcon";
import SelectServiceButton from "./SelectServiceButton";

export default function SelectService({
	originService,
	service,
	setService,
}: {
	originService: ServiceName;
	service: ServiceName | null;
	setService: Dispatch<SetStateAction<ServiceName | null>>;
}) {
	const services = [
		{
			name: "spotify",
			icon: (
				<SelectServiceButton
					selected={service == "spotify"}
					onClick={() => {
						setService(service == "spotify" ? null : "spotify");
					}}>
					<SpotifyIcon />
				</SelectServiceButton>
			),
		},
		{
			name: "youtube",
			icon: (
				<SelectServiceButton
					selected={service == "youtube"}
					onClick={() => {
						setService(service == "youtube" ? null : "youtube");
					}}>
					<YoutubeMusicIcon />
				</SelectServiceButton>
			),
		},
	];

	return (
		<Flex justifyContent="center" my={8} flexWrap="wrap" w="full">
			{services &&
				services
					.filter((service) => service.name !== originService)
					.map((service) => service.icon)}
		</Flex>
	);
}
