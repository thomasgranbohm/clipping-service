import Anchor from 'components/Anchor/Anchor';
import Layout from 'components/Layout/Layout';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { privateAPI } from 'utils/api';

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await privateAPI('/libraries');

	return {
		props: { ...(data as Object) },
	};
};

const Home = ({ ...props }) => {
	const { libraries } = props;

	return (
		<Layout {...props}>
			<Head>
				<title>{process.env.NEXT_PUBLIC_PAGE_TITLE}</title>
			</Head>
			<ul>
				<li>
					<Anchor href={'/clips'}>Clips</Anchor>
				</li>
				{libraries.map(({ key, title }) => (
					<li key={key}>
						<Anchor href={`/library/${key}`}>{title}</Anchor>
					</li>
				))}
			</ul>
		</Layout>
	);
};

export default Home;
