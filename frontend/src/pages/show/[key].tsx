import Anchor from 'components/Anchor/Anchor';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/items/${params.key}/children`);

	return {
		props: { data },
	};
};

export const getPaths = async () => {
	const paths = [];

	const libResp = await privateAPI('/libraries');

	for (const library of libResp.data['libraries']) {
		if (library.type !== 'show') continue;

		const shResp = await privateAPI(`/libraries/${library.key}/contents`);

		for (const show of shResp.data['contents']) {
			if (show.type !== 'show') continue;
			paths.push(show);
		}
	}

	return paths;
};

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = await getPaths();

	return {
		paths: paths.map(({ key }) => ({ params: { key: key } })),
		fallback: 'blocking',
	};
};

const ShowPage = ({ data }) => {
	const { showTitle, metadata, ...rest } = data;

	return (
		<>
			<Breadcrumb {...rest} />
			<h1>{showTitle}</h1>
			<ul>
				{metadata.map(({ key, title, type }) => (
					<li key={key}>
						<Anchor href={`/${type}/${key}`}>{title}</Anchor>
					</li>
				))}
			</ul>
		</>
	);
};

export default ShowPage;
