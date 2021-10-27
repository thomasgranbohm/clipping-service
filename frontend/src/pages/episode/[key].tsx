import Button from 'components/Button/Button';
import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getPaths as getSeasonPaths } from 'pages/season/[key]';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}`);
	return {
		props: data as Object,
		revalidate: 1,
	};
};

const getPaths = async () => {
	const paths = [];

	const seasons = await getSeasonPaths();

	for (const season of seasons) {
		const epResp = await privateAPI(
			`/items/${season.seasonKey}/children?paths`
		);

		for (const episode of epResp.data['details']['metadata']) {
			if (episode.type !== 'episode') continue;

			paths.push(episode);
		}
	}

	return paths;
};

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = await getPaths();

	return {
		paths: paths.map(({ episodeKey }) => ({ params: { key: episodeKey } })),
		fallback: 'blocking',
	};
};

const EpisodePage = (props) => {
	const { details, clips } = props;
	const { episodeTitle, summary, key, ...rest } = details;
	return (
		<Layout {...details}>
			<Head>
				<title>
					{episodeTitle} - {rest.showTitle}
				</title>
				<meta name="description" content={summary} />
				<meta
					property="og:title"
					content={`${episodeTitle} - ${rest.showTitle}`}
				/>
				<meta property="og:description" content={summary} />
				<meta property="og:site_name" content="Clipping Service" />
			</Head>
			<p>{summary}</p>
			<Button type="create" href={`/create?key=${key}`} />
			{clips.length > 0 && <ClipListing clips={clips} />}
		</Layout>
	);
};

export default EpisodePage;
