import ClipListing from 'components/ClipListing/ClipListing';
import { privateAPI } from 'utils/api';
import Head from 'next/head';
import Layout from 'components/Layout/Layout';

export const getStaticProps = async () => {
	const { data } = await privateAPI('/clips');

	return {
		props: data,
		revalidate: 1,
	};
};

const ClipsPage = (props) => {
	const { clips, total } = props;

	return (
		<Layout {...props}>
			<Head>
				<title>Clips</title>
			</Head>
			<ClipListing clips={clips} total={total} />
		</Layout>
	);
};

export default ClipsPage;
