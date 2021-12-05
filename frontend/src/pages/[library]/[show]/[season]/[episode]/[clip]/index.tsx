import Button from 'components/Button/Button';
import Layout from 'components/Layout/Layout';
import Player from 'components/Player/Player';
import SEO from 'components/SEO/SEO';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import { privateAPI } from 'utils/api';
import { addToURL, generateBackendURL } from 'utils/functions';
import { useLoggedIn } from 'utils/hooks';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	try {
		const { library, show, season, episode, clip: slug } = params;
		const urlParams = `library=${library}&show=${show}&season=${season}&episode=${episode}`;
		const { data: clip } = await privateAPI(
			`/clip/${slug}/?${urlParams.toString()}`
		);

		if (!clip) {
			return {
				notFound: true,
				revalidate: 1,
			};
		}

		return {
			props: { clip },
			revalidate: 1,
		};
	} catch (error) {
		if (error['isAxiosError']) {
			if (error['response']['status'] === 404) {
				return {
					notFound: true,
				};
			} else {
				throw error['response']['data'];
			}
		}
		throw error;
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await privateAPI(`/path/clips`);

	return {
		paths: (data as any[]).map(({ clip, episode, season, show, library }) => ({
			params: { clip, episode, season, show, library },
		})),
		fallback: 'blocking',
	};
};

const ClipPage = ({ clip }) => {
	const { slug, title, episode, ready, duration } = clip;
	const { season } = episode;
	const { show } = season;

	const { loggedIn } = useLoggedIn();
	const router = useRouter();

	const backendURL = generateBackendURL(router.asPath);

	return (
		<Layout links={clip}>
			<SEO
				title={`Clip - ${title}`}
				description={`Clip from ${show.title} ${season.title}.
	try {

	} catch (error) {
		if (error['isAxiosError']) {
			if (error['response']['status'] === 404) {
				return {
					notFound: true,
				};
			} else {
				throw error['response']['data'];
			}
		}
		throw error;
	}`}
				image={addToURL(backendURL, `thumbnail`).href}
				oembed={addToURL(backendURL, `oembed`).href}
				video={addToURL(backendURL, `watch`).href}
			/>
			<Player duration={duration} ready={ready} slug={slug} />
			<Button
				type="download"
				href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clip/${slug}/download`}
			>
				Download
			</Button>
			{loggedIn && <Button type="delete" href={backendURL.href} />}
		</Layout>
	);
};
export default ClipPage;
