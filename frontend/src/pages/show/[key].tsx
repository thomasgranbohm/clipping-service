import Anchor from 'components/Anchor/Anchor';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';
import Head from 'next/head';
import ClipListing from 'components/ClipListing/ClipListing';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}/children`);

	return {
		props: { ...(data as Object) },
		revalidate: 1
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
		paths: paths.map(({ key }) => ({ params: { key: key } })),
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
			<ul>
				{metadata.map(({ key, title, type }) => (
					<li key={key}>
						<Anchor href={`/${type}/${key}`}>{title}</Anchor>
					</li>
				))}
			</ul>
			<p>{summary}</p>
			<ClipListing clips={clips} />
		</>
	);
};

export default ShowPage;
