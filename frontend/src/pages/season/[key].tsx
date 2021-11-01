import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { getPaths as getShowPaths } from 'show/[key]';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}/children`);

	return {
		props: { ...(data as Object) },
		revalidate: 1,
	};
};

export const getPaths = async () => {
	const paths = [];

	const shows = await getShowPaths();

	for (const show of shows) {
		const seResp = await privateAPI(`/items/${show.showKey}/children?paths`);

		for (const season of seResp.data['details']['metadata']) {
			if (season.type !== 'season') continue;
			paths.push(season);
		}
	}

	return paths;
};

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = await getPaths();

	return {
		paths: paths.map(({ seasonKey }) => ({ params: { key: seasonKey } })),
		fallback: 'blocking',
	};
};

const SeasonPage = (props) => {
	const { details, clips } = props;
	const { seasonTitle, metadata, ...rest } = details;

	return (
		<Layout {...details}>
			<Head>
				<title>
					{seasonTitle} - {rest.showTitle}
				</title>
				<meta
					property="og:title"
					content={`${seasonTitle} - ${rest.showTitle}`}
				/>
				<meta property="og:site_name" content="Clipping Service" />
			</Head>
			<ThumbnailListing type="episode" items={metadata} />
			{clips.length > 0 && <ClipListing clips={clips} />}
		</Layout>
	);
};

export default SeasonPage;
