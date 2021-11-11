import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const [{ data: library }, { data: shows }] = await Promise.all([
		privateAPI.get(`/library/${params.library}/`),
		privateAPI.get(`/library/${params.library}/shows`),
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

	console.log(library);

	return (
		<Layout links={library}>
			<ThumbnailListing {...shows} />
		</Layout>
	);
};

export default LibraryPage;
