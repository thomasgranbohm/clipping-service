/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	images: {
		domains: ['backend'],
		minimumCacheTTL: 60,
		deviceSizes: [8, 16, 32, 48, 64, 128, 196, 256, 384],
		imageSizes: [8, 16, 32, 48, 64, 96, 128, 256, 384],
	},
	publicRuntimeConfig: {
		GIT_COMMIT: process.env.GIT_COMMIT,
		BACKEND_URL: process.env.BACKEND_URL,
		PAGE_TITLE: 'Clipping Service',
	},
	serverRuntimeConfig: {
		PUBLIC_KEY: process.env.PUBLIC_KEY,
	},
	output: 'standalone',
};
