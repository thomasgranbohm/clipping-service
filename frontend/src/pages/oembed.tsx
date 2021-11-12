import axios from 'axios';
import { GetServerSideProps } from 'next';
import { privateAPI } from 'utils/api';
import { generateBackendURL } from 'utils/functions';

export const getServerSideProps: GetServerSideProps = async ({
	res,
	query,
}) => {
	if ('url' in query === false)
		return {
			props: {},
			redirect: '/',
		};

	const backendURL = generateBackendURL(query.url.toString());
	const requestType = backendURL.pathname.split('/')[1];
	// const { data } = await axios.get(backendURL.href);

	const oembed = {
		version: '1.0',
		type: 'photo',
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}${backendURL.pathname}/thumbnail`,
		height: requestType === 'show' || requestType === 'season' ? 384 : 1024,
		width: 518,
	};

	res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(oembed));
	res.end();

	return {
		props: {},
		redirect: '/',
	};
};

const oEmbed = () => {};

export default oEmbed;
