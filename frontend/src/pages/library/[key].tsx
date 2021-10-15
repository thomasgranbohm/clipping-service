import Anchor from 'components/Anchor/Anchor';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { GetStaticPaths, GetStaticProps } from 'next';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await privateAPI(`/libraries/${params.key}/contents`);

	return {
		props: { ...(data as Object) },
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
			<h1>Library</h1>
			<ul>
				{contents.map(({ key, title, type }) => (
					<li key={key}>
						<Anchor href={`/${type}/${key}`}>{title}</Anchor>
					</li>
				))}
			</ul>
		</>
	);
};

export default LibraryPage;
