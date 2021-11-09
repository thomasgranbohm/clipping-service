import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { library, show, season: index } = params;
	const [{ data: season }, { data: episodes }] = await Promise.all([
		privateAPI(`/${library}/${show}/${index}/`),
		privateAPI(`/${library}/${show}/${index}/?items`),
	]);

	return {
		props: { season, episodes },
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI('/paths/seasons');

	console.log((data as any[]).slice(0, 1).map((data) => ({ params: data })));

	return {
		paths: (data as any[]).map((data) => ({
			params: data,
		})),
		fallback: 'blocking',
	};
};

const SeasonPage = ({ season, episodes }) => {
	const { title, show } = season;
	console.log(episodes);

	return (
		<Layout>
			<Head>
				<title>
					{title} - {show.title}
				</title>
				<meta property="og:title" content={`${title} - ${show.title}`} />
				<meta property="og:site_name" content="Clipping Service" />
			</Head>
			<ThumbnailListing {...episodes} />
			{/* {clips.length > 0 && <ClipListing clips={clips} />} */}
		</Layout>
	);
};

export default SeasonPage;
