import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/libraries/${params.key}/contents`);

	return {
		props: { ...(data as Object) },
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI('/libraries');

	return {
		paths: (data as Object)['libraries'].map(({ key }) => ({
			params: { key },
		})),
		fallback: 'blocking',
	};
};

const LibraryPage = (props) => {
	const { contents } = props;

	return (
		<>
			<Head>
				<title>Clipping Service</title>
			</Head>
			<Breadcrumb />
			<h1>Library</h1>
			<ThumbnailListing type="show" items={contents.slice(0, 1)} />
		</>
	);
};

export default LibraryPage;
