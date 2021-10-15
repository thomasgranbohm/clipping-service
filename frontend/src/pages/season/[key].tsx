import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';
import { getPaths as getShowPaths } from '../show/[key]';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}/children`);

	return {
		props: { data },
	};
};

export const getPaths = async () => {
	const paths = [];

	const shows = await getShowPaths();

	for (const show of shows) {
		const seResp = await privateAPI(`/items/${show.key}/children`);

		for (const season of seResp.data['metadata']) {
			if (season.type !== 'season') continue;
			paths.push(season);
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

const SeasonPage = ({ data }) => {
	const { seasonTitle, metadata, ...rest } = data;

	return (
		<div>
			<Breadcrumb {...rest} />
			<h1>{seasonTitle}</h1>
			<ol>
				{metadata.map(({ key, title }) => (
					<li key={key}>
						<a href={`/episode/${key}`}>{title}</a>
					</li>
				))}
			</ol>
			<pre>
				<code>{JSON.stringify(data, null, 4)}</code>
			</pre>
		</div>
	);
};

export default SeasonPage;
