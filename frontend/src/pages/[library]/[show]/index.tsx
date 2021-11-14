import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import SEO from 'components/SEO/SEO';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { addToURL, generateBackendURL, getURLParams } from 'utils/functions';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const search = getURLParams(params);

	const [{ data: show }, { data: seasons }, { data: clips }] =
		await Promise.all([
			privateAPI(`/show/${params.show}?${search.toString()}`),
			privateAPI(`/show/${params.show}/items?${search.toString()}`),
			privateAPI(`/clip/?${search.toString()}`),
		]);

	return {
		props: { show, seasons, clips },
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI('/path/shows');

	return {
		paths: (data as any[]).map(({ library, show }) => ({
			params: { library, show },
		})),
		fallback: 'blocking',
	};
};

const ShowPage = ({ show, seasons, clips }) => {
	const { title, summary, library } = show;
	const router = useRouter();
	const backendURL = generateBackendURL(router.asPath);

	return (
		<Layout links={show}>
			<Head>
				<SEO
					title={`${title} - ${library.title}`}
					description={summary}
					image={addToURL(backendURL, `thumbnail`).href}
					oembed={`/oembed?url=${router.pathname}`}
				/>
			</Head>
			<p>{summary}</p>
			<ThumbnailListing {...seasons} />
			{clips.total > 0 && <ClipListing {...clips} />}
		</Layout>
	);
};

export default ShowPage;
