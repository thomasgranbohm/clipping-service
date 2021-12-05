import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import SEO from 'components/SEO/SEO';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import { privateAPI } from 'utils/api';
import { addToURL, generateBackendURL, getURLParams } from 'utils/functions';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	try {
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
			<SEO
				title={`${title} - ${show.title}`}
				image={addToURL(backendURL, `thumbnail`).href}
				oembed={`/oembed?url=${router.pathname}`}
			/>
			<ThumbnailListing {...episodes} />
			{clips.total > 0 && <ClipListing {...clips} />}
		</Layout>
	);
};

export default SeasonPage;
