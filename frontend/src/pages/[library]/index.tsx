import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const [{ data: library }, { data: shows }] = await Promise.all([
		privateAPI.get(`/${params.library}/`),
		privateAPI.get(`/${params.library}/?items`),
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
	const resp = await privateAPI('/?items');
	const items = resp.data['items'] as any[];

	return {
		paths: items.map(({ slug }) => ({
			params: { library: slug },
		})),
		fallback: 'blocking',
	};
};

const LibraryPage = (props) => {
	const { shows } = props;

	return (
		<Layout>
			<ThumbnailListing {...shows} />
		</Layout>
	);
};

export default LibraryPage;
