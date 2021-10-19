import { GetServerSideProps } from 'next';
import colors from 'styles/_colors.module.scss';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const manifest = {
		short_name: process.env.PAGE_TITLE,
		name: process.env.PAGE_TITLE,
		start_url: '/',
		background_color: colors['accent'],
		display: 'standalone',
		scope: '/',
		theme_color: colors['accent'],
		icons: [
			{
				src: '/icons/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any maskable',
			},
			{
				src: '/icons/icon-256x256.png',
				sizes: '256x256',
				type: 'image/png',
			},
			{
				src: '/icons/icon-384x384.png',
				sizes: '384x384',
				type: 'image/png',
			},
			{
				src: '/icons/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};

	res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(manifest));
	res.end();

	return {
		props: {},
	};
};

const Manifest = () => {};

export default Manifest;
