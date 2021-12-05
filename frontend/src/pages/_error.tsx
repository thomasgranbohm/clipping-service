import Layout from 'components/Layout/Layout';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const statusCode = res ? res.statusCode : 404;
	return { props: { statusCode } };
};

const ErrorPage = ({ statusCode }) => {
	const title =
		statusCode === 404 ? 'Page not found.' : 'Something went wrong.';

	return (
		<Layout>
			<Head>
				<title>{title}</title>
			</Head>
			<h1>{title}</h1>
		</Layout>
	);
};

export default ErrorPage;
