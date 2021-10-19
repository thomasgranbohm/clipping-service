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
				src: '/icons/icon-72x72.png',
				sizes: '72x72',
				type: 'image/png',
				purpose: 'maskable any',
			},
			{
				src: '/icons/icon-96x96.png',
				sizes: '96x96',
				type: 'image/png',
				purpose: 'maskable any',
			},
			{
				src: '/icons/icon-128x128.png',
				sizes: '128x128',
				type: 'image/png',
				purpose: 'maskable any',
			},
			{
				src: '/icons/icon-144x144.png',
				sizes: '144x144',
				type: 'image/png',
				purpose: 'maskable any',
			},
			{
				src: '/icons/icon-152x152.png',
				sizes: '152x152',
				type: 'image/png',
				purpose: 'maskable any',
			},
			{
				src: '/icons/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable any',
			},
			{
				src: '/icons/icon-384x384.png',
				sizes: '384x384',
				type: 'image/png',
				purpose: 'maskable any',
			},
			{
				src: '/icons/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable any',
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
