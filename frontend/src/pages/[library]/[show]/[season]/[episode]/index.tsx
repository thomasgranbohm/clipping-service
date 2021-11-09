import Button from 'components/Button/Button';
import Layout from 'components/Layout/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { library, show, season, episode: episodeSlug } = params;
	const url = `/${library}/${show}/${season}/${episodeSlug}`;
	const [{ data: episode }, { data: clips }] = await Promise.all([
		privateAPI(url),
		privateAPI(`${url}/?items`),
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
	const { data } = await privateAPI('/paths/episodes');

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

	console.log(episode);

	return (
		<Layout>
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
