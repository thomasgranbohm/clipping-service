import Button from 'components/Button/Button';
import ClipCreator from 'components/ClipCreator/ClipCreator';
import ClipListing from 'components/ClipListing/ClipListing';
import Image from 'components/Image/Image';
import Layout from 'components/Layout/Layout';
import Summary from 'components/Summary/Summary';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { addToURL, generateBackendURL, getURLParams } from 'utils/functions';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { episode: episodeSlug } = params;
	const urlParams = getURLParams(params);
	const [{ data: episode }, { data: clips }] = await Promise.all([
		privateAPI(`/episode/${episodeSlug}/?${urlParams.toString()}`),
		privateAPI(`/episode/${episodeSlug}/items?${urlParams.toString()}`),
	]);

	return {
		props: {
			episode,
			clips,
		},
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI('/path/episodes');

	return {
		paths: (data as any[]).map((data) => ({
			params: data,
		})),
		fallback: 'blocking',
	};
};

const EpisodePage = ({ episode, clips }) => {
	const { title, season, summary } = episode;
	const { show } = season;
	const { loggedIn } = useLoggedIn();
	const router = useRouter();

	const backendURL = generateBackendURL(router.asPath);

	return (
		<Layout links={episode}>
			<Head>
				<title>
					{title} - {show.title}
				</title>
				<meta name="description" content={summary} />
				<meta property="og:title" content={`${title} - ${show.title}`} />
				<meta property="og:description" content={summary} />
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
			<Summary
				image={
					!loggedIn && {
						alt: 'thumbnail',
						height: 1080,
						src: addToURL(backendURL, 'thumbnail').href,
						width: 1920,
					}
				}
			>
				{summary}
			</Summary>
			{loggedIn && <ClipCreator episode={episode} />}
			{clips.total > 0 && <ClipListing {...clips} />}
		</Layout>
	);
};

export default EpisodePage;
