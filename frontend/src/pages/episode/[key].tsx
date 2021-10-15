import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getPaths as getSeasonPaths } from 'pages/season/[key]';
import { privateAPI } from 'utils/api';
import Head from 'next/head';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}`);
	return {
		props: { ...(data as Object) },
	};
};

const getPaths = async () => {
	const paths = [];

	const seasons = await getSeasonPaths();

	for (const season of seasons) {
		const epResp = await privateAPI(`/items/${season.key}/children`);

		for (const episode of epResp.data['metadata']) {
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

const EpisodePage = (props) => {
	const { episodeTitle, summary, ...rest } = props;
	return (
		<>
			<Head>
				<title>
					{episodeTitle} - {rest.showTitle}
				</title>
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
		</>
	);
};

export default EpisodePage;
