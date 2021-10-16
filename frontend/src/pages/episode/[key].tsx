import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ClipListing from 'components/ClipListing/ClipListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getPaths as getSeasonPaths } from 'pages/season/[key]';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}`);
	return {
		props: data as Object,
	};
};

const getPaths = async () => {
	const paths = [];

	const seasons = await getSeasonPaths();

	for (const season of seasons) {
		const epResp = await privateAPI(`/items/${season.key}/children`);

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
		paths: paths.map(({ key }) => ({ params: { key } })),
		fallback: 'blocking',
	};
};

const EpisodePage = ({ details, clips }) => {
	const { episodeTitle, summary, ...rest } = details;
	return (
		<>
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
			<Breadcrumb {...rest} />
			<h1>{episodeTitle}</h1>
			<p>{summary}</p>
			<ClipListing clips={clips} />
		</>
	);
};

export default EpisodePage;
