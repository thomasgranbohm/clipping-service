import ClipListing from 'components/ClipListing/ClipListing';
import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const [{ data: show }, { data: seasons }] = await Promise.all([
		privateAPI(`/${params.library}/${params.show}`),
		privateAPI(`/${params.library}/${params.show}/?items`),
	]);

	return {
		props: { show, seasons },
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI('/paths/shows');

	return {
		paths: (data as any[]).map(({ library, show }) => ({
			params: { library, show },
		})),
		fallback: 'blocking',
	};
};

const ShowPage = ({ show, seasons }) => {
	const { title, summary } = show;

	console.log(seasons);

	return (
		<Layout>
			<Head>
				<title>{title}</title>
				<meta name="description" content={summary} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={summary} />
				<meta property="og:site_name" content="Clipping Service" />
			</Head>
			<p>{summary}</p>
			<ThumbnailListing {...seasons} />
			{/* {clips.length > 0 && <ClipListing clips={clips} />} */}
		</Layout>
	);
};

export default ShowPage;
