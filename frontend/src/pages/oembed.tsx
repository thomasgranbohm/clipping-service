import { GetServerSideProps } from 'next';
import { addToURL, generateBackendURL } from 'utils/functions';

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

	const oembed = {
		version: '1.0',
		type: 'photo',
		url: addToURL(backendURL, 'thumbnail'),
		height: requestType === 'show' || requestType === 'season' ? 512 : 288,
		width: requestType === 'show' || requestType === 'season' ? 384 : 512,
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
