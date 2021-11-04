import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const [{ data: library }, { data: shows }] = await Promise.all([
		privateAPI.get(`/libraries/${params.library}`),
		privateAPI.get(`/libraries/${params.library}/shows`),
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
	const resp = await privateAPI('/paths/libraries');
	const libraries = resp.data['libraries'] as any[];

	return {
		paths: libraries.map((library) => ({
			params: { library },
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
