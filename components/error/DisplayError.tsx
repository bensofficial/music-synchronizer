import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Code,
	AlertProps,
} from "@chakra-ui/react";
export default function DisplayError({
	errorMessage,
	...props
}: AlertProps & {
	errorMessage: string;
}) {
	return (
		<Alert
			{...props}
			status="error"
			w="100%"
			minH="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			p={4}
			textAlign="center"
			borderRadius="xl">
			<AlertIcon boxSize="40px" mr={0} />
			<AlertTitle mt={4} mb={1} fontSize="lg">
				Error
			</AlertTitle>
			<AlertDescription maxW="xl">
				A critical error occurred
			</AlertDescription>
			<AlertDescription maxW="lg">
				<Code my={2} colorScheme="red" fontSize="sm">
					{String(errorMessage)}
				</Code>
			</AlertDescription>
		</Alert>
	);
}
