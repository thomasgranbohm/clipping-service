import Button from 'components/Button/Button';
import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { show, season, episode: episodeSlug } = params;
	const url = `/episodes/${show}/${season}/${episodeSlug}`;
	const [{ data: episode }, { data: clips }] = await Promise.all([
		privateAPI(url),
		privateAPI(`${url}/clips`),
	]);

	console.log(clips);

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

	return (
		<Layout>
			<Head>
				<title>
					{title} - {show.title}
				</title>
				<meta name="description" content={summary} />
				<meta property="og:title" content={`${title} - ${show.title}`} />
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
