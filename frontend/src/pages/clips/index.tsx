import ClipListing from 'components/ClipListing/ClipListing';
import { privateAPI } from 'utils/api';
import Head from 'next/head';

export const getStaticProps = async () => {
	const { data } = await privateAPI('/clips');
	console.log(data);

	return {
		props: data,
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
