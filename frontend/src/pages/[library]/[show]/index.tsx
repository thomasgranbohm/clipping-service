import Layout from 'components/Layout/Layout';
import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { generateBackendURL } from 'utils/functions';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const [{ data: show }, { data: seasons }] = await Promise.all([
		privateAPI(`/show/${params.show}?library=${params.library}`),
		privateAPI(`/show/${params.show}/items?library=${params.library}`),
	]);

	return {
		props: { show, seasons },
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI('/path/shows');

	return {
		paths: (data as any[]).map(({ library, show }) => ({
			params: { library, show },
		})),
		fallback: 'blocking',
	};
};

const ShowPage = ({ show, seasons }) => {
	const { title, summary } = show;
	const router = useRouter();

	return (
		<Layout links={show}>
			<Head>
				<title>{title}</title>
				<meta name="description" content={summary} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={summary} />
				<meta property="og:site_name" content="Clipping Service" />
				<link
					rel="alternate"
					type="application/json+oembed"
					href={`/oembed?url=${router.pathname}`}
				/>
			</Head>
			<p>{summary}</p>
			<ThumbnailListing {...seasons} />
			{/* {clips.length > 0 && <ClipListing clips={clips} />} */}
		</Layout>
	);
};

export default ShowPage;
