import Anchor from 'components/Anchor/Anchor';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';
import { getPaths as getShowPaths } from '../show/[key]';
import Head from 'next/head';
import ClipListing from 'components/ClipListing/ClipListing';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}/children`);

	return {
		props: { ...(data as Object) },
	};
};

export const getPaths = async () => {
	const paths = [];

	const shows = await getShowPaths();

	for (const show of shows) {
		const seResp = await privateAPI(`/items/${show.key}/children`);

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
		paths: paths.map(({ key }) => ({ params: { key } })),
		fallback: 'blocking',
	};
};

const SeasonPage = ({ details, clips }) => {
	const { seasonTitle, metadata, ...rest } = details;

	return (
		<>
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
			<Breadcrumb {...rest} />
			<h1>{seasonTitle}</h1>
			<ol>
				{metadata.map(({ key, title }) => (
					<li key={key}>
						<Anchor href={`/episode/${key}`}>{title}</Anchor>
					</li>
				))}
			</ol>
			<ClipListing clips={clips} />
		</>
	);
};

export default SeasonPage;
