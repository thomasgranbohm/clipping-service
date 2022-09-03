import Layout from 'components/Layout/Layout';
import SEO from 'components/SEO/SEO';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	try {
		const [{ data: library }, { data: shows }] = await Promise.all([
			privateAPI.get(`/library/${params.library}/`),
			privateAPI.get(`/library/${params.library}/items`),
		]);

		return {
			props: {
				library,
				shows,
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

	const resp = await privateAPI('/path/libraries');
	const items = resp.data as any[];

	return {
		paths: items.map((library) => ({
			params: { library },
		})),
		fallback: 'blocking',
	};
};

const { publicRuntimeConfig } = getConfig();

const LibraryPage = (props) => {
	const { shows, library } = props;

	return (
		<Layout links={library}>
			<SEO title={`${library.title} - ${publicRuntimeConfig.PAGE_TITLE}`} />
			<ThumbnailListing {...shows} />
		</Layout>
	);
};

export default LibraryPage;
