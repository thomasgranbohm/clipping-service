import Button from 'components/Button/Button';
import Layout from 'components/Layout/Layout';
import Player from 'components/Player/Player';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { privateAPI } from 'utils/api';
import { generateBackendURL } from 'utils/functions';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/clip/${params.slug}`);

	if (!data) {
		return {
			notFound: true,
			revalidate: 1,
		};
	}

	return {
		props: { clip: data },
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI(`/path/clips`);

	return {
		paths: data['clips'].map(({ slug }) => ({
			params: { slug },
		})),
		fallback: 'blocking',
	};
};

const ClipPage = ({ clip }) => {
	const { slug, name, episode, ready, duration } = clip;
	const { season } = episode;
	const { show } = season;

	const { loggedIn } = useLoggedIn();
	const router = useRouter();

	const backendURL = generateBackendURL(router.asPath);

	return (
		<Layout links={clip}>
			<Head>
				<title>Clip - {name}</title>
				<meta
					name="description"
					content={`Clip from ${show.title} ${season.title}.`}
				/>
				<meta property="og:title" content={`Clip - ${name}`} />
				<meta property="og:site_name" content="Clipping Service" />
				<meta
					property="og:description"
					content={`Clip from ${show.title} ${season.title}.`}
				/>
				<meta property="og:video" content={`${backendURL.href}/watch`} />
				<meta property="og:image" content={`${backendURL.href}/thumbnail`} />
				<link
					type="application/json+oembed"
					href={`${backendURL.href}/oembed`}
				/>
			</Head>
			<Player duration={duration} ready={ready} slug={slug} />
			<Button type="download" href={`${backendURL.href}/download`} />
			{loggedIn && <Button type="delete" href={`${backendURL.href}`} />}
		</Layout>
	);
};
export default ClipPage;
