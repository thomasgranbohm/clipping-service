import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ClipListing from 'components/ClipListing/ClipListing';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
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

	const libResp = await privateAPI('/libraries');

	for (const library of libResp.data['libraries']) {
		if (library.type !== 'show') continue;

		const shResp = await privateAPI(`/libraries/${library.key}/contents`);

		for (const show of shResp.data['contents']) {
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

const ShowPage = ({ details, clips }) => {
	const { showTitle, summary, metadata, ...rest } = details;

	return (
		<>
			<Head>
				<title>{showTitle}</title>
				<meta name="description" content={summary} />
				<meta property="og:title" content={showTitle} />
				<meta property="og:description" content={summary} />
				<meta property="og:site_name" content="Clipping Service" />
			</Head>
			<Breadcrumb {...rest} />
			<h1>{showTitle}</h1>
			<p>{summary}</p>
			<ThumbnailListing type="season" items={metadata.slice(0, 1)} />
			{clips.length > 0 && <ClipListing clips={clips} />}
		</>
	);
};

export default ShowPage;
