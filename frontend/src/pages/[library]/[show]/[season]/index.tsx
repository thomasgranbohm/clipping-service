import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { addToURL, generateBackendURL, getURLParams } from 'utils/functions';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const search = getURLParams(params);
	const [{ data: season }, { data: episodes }, { data: clips }] =
		await Promise.all([
			privateAPI(`/season/${params.season}/?${search.toString()}`),
			privateAPI(`/season/${params.season}/items?${search.toString()}`),
			privateAPI(`/clip/?${search.toString()}`),
		]);

	return {
		props: { season, episodes, clips },
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

const SeasonPage = ({ season, episodes, clips }) => {
	const { title, show } = season;

	const router = useRouter();
	const backendURL = generateBackendURL(router.asPath);

	return (
		<Layout links={season}>
			<Head>
				<title>
					{title} - {show.title}
				</title>
				<meta property="og:title" content={`${title} - ${show.title}`} />
				<meta property="og:site_name" content="Clipping Service" />
				<meta
					property="og:image"
					content={addToURL(backendURL, 'thumbnail').href}
				/>
				<link
					rel="alternate"
					type="application/json+oembed"
					href={`/oembed?url=${router.pathname}`}
				/>
			</Head>
			<ThumbnailListing {...episodes} />
			{clips.total > 0 && <ClipListing {...clips} />}
		</Layout>
	);
};

export default SeasonPage;
