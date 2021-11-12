import Button from 'components/Button/Button';
import Layout from 'components/Layout/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { addToURL, generateBackendURL } from 'utils/functions';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { library, show, season, episode: episodeSlug } = params;
	const urlParams = `library=${library}&show=${show}&season=${season}`;
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
				<link rel="alternate" type="application/json+oembed" href={`/oembed?url=${router.pathname}`} />
			</Head>
			<p>{summary}</p>
			{loggedIn && (
				<Button type="create" href={`/create?path=${router.asPath}`} />
			)}
			{/* {clips.total > 0 && <ClipListing {...clips} />} */}
		</Layout>
	);
};

export default EpisodePage;
