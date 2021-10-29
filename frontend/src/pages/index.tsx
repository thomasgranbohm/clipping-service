import Anchor from 'components/Anchor/Anchor';
import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import LibraryListing from 'components/LibraryListing/LibraryListing';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async () => {
	const [libraryResp, clipResp] = await Promise.all([
		privateAPI('/libraries'),
		privateAPI('/clips'),
	]);

	return {
		props: {
			libraries: libraryResp.data['libraries'],
			clipResponse: clipResp.data,
		},
	};
};

const Home = ({ ...props }) => {
	const { clipResponse, libraries } = props;
	const { clips, total } = clipResponse;

	return (
		<Layout {...props}>
			<Head>
				<title>{process.env.NEXT_PUBLIC_PAGE_TITLE}</title>
			</Head>
			<h2>Libraries</h2>
			<LibraryListing libraries={libraries} />
			<ClipListing clips={clips} total={total} />
		</Layout>
	);
};

export default Home;
