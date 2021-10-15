import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getPaths as getSeasonPaths } from 'pages/season/[key]';
import { privateAPI } from 'utils/api';

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
		<div>
			<Breadcrumb {...rest} />
			<h1>{episodeTitle}</h1>
			<p>{summary}</p>
			<pre>
				<code>{JSON.stringify(props, null, 4)}</code>
			</pre>
		</div>
	);
};

export default EpisodePage;