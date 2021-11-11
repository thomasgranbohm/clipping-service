import Button from 'components/Button/Button';
import Layout from 'components/Layout/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { library, show, season, episode: episodeSlug } = params;
	const [{ data: episode }, { data: clips }] = await Promise.all([
		privateAPI(
			`/episode/${episodeSlug}/?library=${library}&show=${show}&season=${season}`
		),
		privateAPI(
			`/episode/${episodeSlug}/clips?library=${library}&show=${show}&season=${season}`
		),
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

	return (
		<Layout links={episode}>
			<Head>
				<title>{/* {title} - {show.title} */}</title>
				<meta name="description" content={summary} />
				<meta property="og:title" content={`${title}`} />
				<meta property="og:description" content={summary} />
				<meta property="og:site_name" content="Clipping Service" />
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
