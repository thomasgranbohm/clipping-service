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
		<div>
			<h1>Hello World!</h1>
			<ul>
				{libraries.map(({ key, title }) => (
					<li key={key}>
						<a href={`/library/${key}`}>{title}</a>
					</li>
				))}
			</ul>
			<pre>
				<code>{JSON.stringify(props, null, 4)}</code>
			</pre>
		</div>
	);
};

export default Home;
