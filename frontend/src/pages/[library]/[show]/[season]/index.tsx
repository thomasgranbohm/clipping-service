import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { library, show, season: index } = params;
	const [{ data: season }, { data: episodes }] = await Promise.all([
		privateAPI(`/season/${index}/?library=${library}&show=${show}`),
		privateAPI(`/season/${index}/items?library=${library}&show=${show}`),
	]);

	return {
		props: { season, episodes },
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI('/path/seasons');

	return {
		paths: (data as any[]).map((data) => ({
			params: data,
		})),
		fallback: 'blocking',
	};
};

const SeasonPage = ({ season, episodes }) => {
	const { title, show } = season;

	const router = useRouter();

	return (
		<Layout links={season}>
			<Head>
				<title>
					{show.title} - {title}
				</title>
				<meta property="og:title" content={`${show.title} - ${title}`} />
				<meta property="og:site_name" content="Clipping Service" />
				<link
					rel="alternate"
					type="application/json+oembed"
					href={`/oembed?url=${router.pathname}`}
				/>
			</Head>
			<ThumbnailListing {...episodes} />
			{/* {clips.length > 0 && <ClipListing clips={clips} />} */}
		</Layout>
	);
};

export default SeasonPage;
