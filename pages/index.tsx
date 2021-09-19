import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { DiscordUser } from '../utils/types';
import { parseUser } from '../utils/parse-user';
import { Box, Image, Text, Wrap, Link } from '@chakra-ui/react';
import axios from 'axios';
interface Props {
	user: DiscordUser;
}

export default function Home({ user, guilds }: any) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-3">
			<Text variant="h2" fontSize="2xl">
				Choose a server to view the suggestions of
			</Text>
			<Wrap>
				{guilds.map((x: any, y: any) => (
					<Box cursor="pointer" key={y} maxW="10rem">
						<Link passHref href={`/guilds/${x.id}`}>
							<Box>
								<Image alt={x.name} src={x.icon || '/notfound.png'} />
								<Text className="text-center">{x.name}</Text>
							</Box>
						</Link>
					</Box>
				))}
			</Wrap>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async function (
	ctx
) {
	const user = await parseUser(ctx);

	if (!user) {
		return {
			redirect: {
				destination: '/api/login',
				permanent: false,
			},
		};
	}

	let guilds = await axios.post('http://localhost:8080/guilds', user.guilds);

	return { props: { user, guilds: guilds.data } };
};
