import Buttons from "$components/layout/Buttons";
import Container from "$components/layout/Container";
import Nav from "$components/layout/Nav";
import { Button, Flex, Heading, Icon, Link, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { FiArrowRight } from "react-icons/fi";

const Home: NextPage = () => {
	return (
		<Flex h="100vh" w="100vw" flexDirection="column">
			<Container mb={4} borderBottomWidth="2px">
				<Nav>
					<Button rightIcon={<Icon as={FiArrowRight} />}>
						<Link href="/dashboard">Visit dashboard</Link>
					</Button>
				</Nav>
			</Container>
			<Container
				flexGrow={1}
				display="flex"
				flexDirection="column"
				alignItems="center">
				<Flex
					mt="6%"
					width="100%"
					textAlign="center"
					alignItems="center"
					flexDirection="column">
					<Heading
						bgGradient="linear(to-l, #007CF0, #00DFD8)"
						bgClip="text"
						wordBreak="keep-all"
						fontWeight="extrabold"
						lineHeight="max(4rem, 10.4vw)"
						fontSize="max(3rem, 8vw)">
						Music <br /> Synchronizer
					</Heading>
					<Text
						mb="8"
						w="min(40rem, 100%)"
						fontWeight="thin"
						fontSize="max(1.5rem, 2vw)">
						A powerful tool to synchronize your music between
						multiple services
					</Text>
					<Buttons size="lg">
						<Button
							variant="outline"
							size="lg"
							rightIcon={<Icon as={FiArrowRight} />}>
							<Link href="/dashboard">Visit dashboard</Link>
						</Button>
					</Buttons>
				</Flex>
			</Container>
		</Flex>
	);
};

export default Home;
