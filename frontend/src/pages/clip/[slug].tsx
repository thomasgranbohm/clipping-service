import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Video from 'components/Video/Video';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI, publicAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const clip = await privateAPI(`/clips/${params.slug}`);

	if (!clip) {
		return {
			notFound: true,
		};
	}

	return {
		props: { clip: clip.data },
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

const ClipPage = ({ clip }) => {
	const { slug, name, id } = clip;

	return (
		<>
			<Breadcrumb {...clip} />
			<h1>{name}</h1>
			<Video slug={slug} />
		</>
	);
};
export default ClipPage;
