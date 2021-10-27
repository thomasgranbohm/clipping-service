import Button from 'components/Button/Button';
import Layout from 'components/Layout/Layout';
import Player from 'components/Player/Player';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const clip = await privateAPI(`/clips/${params.slug}`);

	if (!clip) {
		return {
			notFound: true,
			revalidate: 1,
		};
	}

	return {
		props: { clip: clip.data },
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI(`/clips`);

	return {
		paths: data['clips'].map((clip) => ({
			params: { slug: clip.slug.toString() },
		})),
		fallback: 'blocking',
	};
};

const ClipPage = (props) => {
	const { clip } = props;
	const { slug, name, seasonTitle, showTitle, ready, duration } = clip;

	const { loggedIn } = useLoggedIn();

	return (
		<Layout {...clip}>
			<Head>
				<title>Clip - {name}</title>
				<meta
					name="description"
					content={`Clip from ${showTitle} ${seasonTitle}.`}
				/>
				<meta property="og:title" content={`Clip - ${name}`} />
				<meta property="og:site_name" content="Clipping Service" />
				<meta
					property="og:description"
					content={`Clip from ${showTitle} ${seasonTitle}.`}
				/>
				<meta
					property="og:video"
					content={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/watch`}
				/>
				<meta
					property="og:image"
					content={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/thumbnail`}
				/>
				<link
					type="application/json+oembed"
					href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/oembed`}
				/>
			</Head>
			<Player duration={duration} ready={ready} slug={slug} />
			<Button
				type="download"
				href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/download`}
			/>
			{loggedIn && (
				<Button
					type="delete"
					href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}`}
				/>
			)}
		</Layout>
	);
};
export default ClipPage;
