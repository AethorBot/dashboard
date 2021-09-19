import fetch from 'node-fetch';
import { Box, Text, SimpleGrid, Button, Badge } from '@chakra-ui/react';
import { parseUser } from '../../utils/parse-user';

import axios from 'axios';
import {
	DiscordEmbed,
	DiscordEmbedField,
	DiscordMessage,
	DiscordMessages,
} from '@skyra/discord-components-react';
import router from 'next/router';
const GuildInfo = ({ suggestions }: any) => {
	if (!suggestions)
		return (
			<>
				<Text>Failed to load data</Text>
			</>
		);
	return (
		<Box>
			<DiscordMessages>
				<Text>Total suggestions Count {suggestions.total_count}</Text>
				{suggestions.data.map((x: any, y: any) => {
					return (
						// <GridItem key={y}>
						<DiscordMessage key={y} author="Aethor" avatar="/aethor.png" bot>
							{/* <Text>{x.content}</Text> */}
							<DiscordEmbed
								slot="embeds"
								color="#019DD8"
								author-name={`Suggestion ${x.publicid}`}
								// embed-title="Big Buck Bunny"
							>
								<DiscordEmbedField fieldTitle={`Suggestion ${x.publicid}`}>
									{x.content}
								</DiscordEmbedField>
								<Box />
								<Badge borderRadius="full" px="2" colorScheme="teal">
									Up Votes {x.up}
								</Badge>
								<Badge borderRadius="full" px="2" colorScheme="orange">
									Down Votes {x.down}
								</Badge>
							</DiscordEmbed>
						</DiscordMessage>
						// </Grid   Item>
					);
				})}

				<Button
					onClick={() => {
						router.replace(
							{
								pathname: `/guilds/${router.query.slug}`,
								query: {
									page: parseInt(router.query.page as any) - 1 || 1,
								},
							},
							undefined,
							{
								scroll: true,
								shallow: false,
							}
						);
					}}
				>
					Previous Page
				</Button>
				<Button
					onClick={() => {
						router.replace(
							{
								pathname: `/guilds/${router.query.slug}`,
								query: {
									page: parseInt(router.query.page as any) + 1 || 1,
								},
							},
							undefined,
							{
								scroll: true,
								shallow: false,
							}
						);
					}}
				>
					Next Page
				</Button>
			</DiscordMessages>
		</Box>
	);
};
export const getServerSideProps = async (ctx: any) => {
	const {
		query: { slug, page },
	} = ctx;

	const user = await parseUser(ctx);

	if (!user) {
		return {
			redirect: {
				destination: '/api/login',
				permanent: false,
			},
		};
	}

	const includes = await new Promise((res) => {
		for (const g of user.guilds) {
			if (g == slug) res(true);
		}
		res(false);
	});

	if (!includes)
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};

	const res = await axios.get(
		`http://localhost:8080/suggestions?guild=${slug}&limit=25&page=${page}`
	);
	if (!res.data)
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	// console.log(res.data);
	// console.log(user);
	return { props: { slug, suggestions: res.data } };
};
export default GuildInfo;
