import ClipCreator from 'components/ClipCreator/ClipCreator';
import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import SEO from 'components/SEO/SEO';
import Summary from 'components/Summary/Summary';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import { privateAPI } from 'utils/api';
import { addToURL, generateBackendURL, getURLParams } from 'utils/functions';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	try {
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
	} catch (error) {
		if (error['isAxiosError']) {
			if (error['response']['status'] === 404) {
				return {
					notFound: true,
				};
			} else {
				throw error['response']['data'];
			}
		}
		throw error;
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	if (process.env.SKIP_BUILD_STATIC_GENERATION) {
		return {
			paths: [],
			fallback: 'blocking',
		};
	}

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
		<Layout
			links={episode}
			displayLoginButton={typeof loggedIn === 'boolean' ? !loggedIn : true}
		>
			<SEO
				title={`${title} - ${show.title}`}
				description={summary}
				image={addToURL(backendURL, `thumbnail`).href}
				oembed={`/oembed?url=${router.pathname}`}
			/>
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
