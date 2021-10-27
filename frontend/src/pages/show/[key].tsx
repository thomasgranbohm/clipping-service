import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getPaths as getLibraryPaths } from 'pages/library/[key]';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}/children`);

	return {
		props: { ...(data as Object) },
		revalidate: 1,
	};
};

export const getPaths = async () => {
	const paths = [];

	const libraries = await getLibraryPaths();

	for (const library of libraries) {
		if (library.type !== 'show') continue;

		const shResp = await privateAPI(`/libraries/${library.key}/contents?paths`);

		for (const show of shResp.data['contents']['items']) {
			if (show.type !== 'show') continue;
			paths.push(show);
		}
	}

	return paths;
};

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = await getPaths();

	return {
		paths: paths.map(({ showKey }) => ({ params: { key: showKey } })),
		fallback: 'blocking',
	};
};

const ShowPage = (props) => {
	const { details, clips } = props;
	const { showTitle, summary, metadata, ...rest } = details;

	return (
		<Layout {...details}>
			<Head>
				<title>{showTitle}</title>
				<meta name="description" content={summary} />
				<meta property="og:title" content={showTitle} />
				<meta property="og:description" content={summary} />
				<meta property="og:site_name" content="Clipping Service" />
			</Head>
			<p>{summary}</p>
			<ThumbnailListing type="season" items={metadata} />
			{clips.length > 0 && <ClipListing clips={clips} />}
		</Layout>
	);
};

export default ShowPage;
