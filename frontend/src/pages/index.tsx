import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import LibraryListing from 'components/LibraryListing/LibraryListing';
import SEO from 'components/SEO/SEO';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { privateAPI } from 'utils/api';

export const getServerSideProps: GetServerSideProps = async () => {
	const [{ data: libraries }, { data: clips }] = await Promise.all([
		privateAPI('/library'),
		privateAPI('/clip'),
	]);

	return {
		props: {
			libraries,
			clips,
		},
	};
};

const { publicRuntimeConfig } = getConfig();

const Home = ({ clips, libraries }) => {
	return (
		<Layout>
			<SEO title={publicRuntimeConfig.PAGE_TITLE} />
			<h2>Libraries</h2>
			<LibraryListing {...libraries} />
			<ClipListing {...clips} />
		</Layout>
	);
};

export default Home;
