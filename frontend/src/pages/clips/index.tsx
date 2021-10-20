import ClipListing from 'components/ClipListing/ClipListing';
import { privateAPI } from 'utils/api';
import Head from 'next/head';

export const getStaticProps = async () => {
	const { data } = await privateAPI('/clips');

	return {
		props: data,
		revalidate: 1,
	};
};

const ClipsPage = ({ clips }) => (
	<>
		<Head>
			<title>Clips</title>
		</Head>
		<ClipListing clips={clips} />
	</>
);

export default ClipsPage;
