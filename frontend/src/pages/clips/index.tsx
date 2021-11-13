import ClipListing from 'components/ClipListing/ClipListing';
import { privateAPI } from 'utils/api';
import Head from 'next/head';
import Layout from 'components/Layout/Layout';

export const getStaticProps = async () => {
	const { data } = await privateAPI('/clip');

	return {
		props: {
			clips: data,
		},
		revalidate: 1,
	};
};

const ClipsPage = ({ clips }) => {
	return (
		<Layout>
			<Head>
				<title>Clips</title>
			</Head>
			<ClipListing {...clips} />
		</Layout>
	);
};

export default ClipsPage;
