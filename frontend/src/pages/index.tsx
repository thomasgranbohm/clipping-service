import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import LibraryListing from 'components/LibraryListing/LibraryListing';
import SEO from 'components/SEO/SEO';
import { GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async () => {
	const [{ data: libraries }, { data: clips }] = await Promise.all([
		privateAPI('/library'),
		privateAPI('/clip'),
	]);

	return {
		props: {
			libraries,
			clips,
		},
		revalidate: 1,
	};
};

const Home = ({ clips, libraries }) => {
	return (
		<Layout>
			<SEO title={process.env.NEXT_PUBLIC_PAGE_TITLE} />
			<h2>Libraries</h2>
			<LibraryListing {...libraries} />
			<ClipListing {...clips} />
		</Layout>
	);
};

export default Home;
