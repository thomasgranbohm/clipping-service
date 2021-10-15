import Anchor from 'components/Anchor/Anchor';
import { GetStaticProps } from 'next';
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
			<h1>Hello World!</h1>
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
