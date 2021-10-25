import Anchor from 'components/Anchor/Anchor';
import Button from 'components/Button/Button';
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
		<>
			<Head>
				<title>{process.env.NEXT_PUBLIC_PAGE_TITLE}</title>
			</Head>
			<h1>Hello World!</h1>
			<Button type="download" href={'/favicon.ico'} />
			<Button type="delete" href={'/favicon.ico'} />
			<ul>
				{libraries.map(({ key, title }) => (
					<li key={key}>
						<Anchor href={`/library/${key}`}>{title}</Anchor>
					</li>
				))}
			</ul>
		</>
	);
};

export default Home;
