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
		EXTERNAL_BACKEND_URL: process.env.EXTERNAL_BACKEND_URL,
		EXTERNAL_FRONTEND_URL: process.env.EXTERNAL_FRONTEND_URL,
		INTERNAL_BACKEND_URL: process.env.INTERNAL_BACKEND_URL,
		INTERNAL_FRONTEND_URL: process.env.INTERNAL_FRONTEND_URL,
		GIT_COMMIT: process.env.GIT_COMMIT,
		PAGE_TITLE: process.env.PAGE_TITLE,
	},
	serverRuntimeConfig: {
		PUBLIC_KEY: process.env.PUBLIC_KEY,
	},
	basePath: process.env.BASE_PATH,
	output: 'standalone',
};
