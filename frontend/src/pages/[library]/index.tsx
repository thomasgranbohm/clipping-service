import Layout from 'components/Layout/Layout';
import SEO from 'components/SEO/SEO';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
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
};

export const getStaticPaths: GetStaticPaths = async () => {
	const resp = await privateAPI('/path/libraries');
	const items = resp.data as any[];

	return {
		paths: items.map((library) => ({
			params: { library },
		})),
		fallback: 'blocking',
	};
};

const LibraryPage = (props) => {
	const { shows, library } = props;

	return (
		<Layout links={library}>
			<Head>
				<SEO
					title={`${library.title} - ${process.env.NEXT_PUBLIC_PAGE_TITLE}`}
				/>
			</Head>
			<ThumbnailListing {...shows} />
		</Layout>
	);
};

export default LibraryPage;
