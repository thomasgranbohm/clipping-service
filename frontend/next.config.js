/** @type {import('next').NextConfig} */

const urls = [
	process.env.EXTERNAL_BACKEND_URL,
	process.env.INTERNAL_BACKEND_URL,
].map((url) => new URL(url).hostname);

module.exports = {
	reactStrictMode: true,
	images: {
		domains: urls,
		minimumCacheTTL: 60,
		deviceSizes: [8, 16, 32, 48, 64, 128, 196, 256, 384],
		imageSizes: [8, 16, 32, 48, 64, 96, 128, 256, 384],
	},
	publicRuntimeConfig: {
		imageDomains: urls,
		EXTERNAL_BACKEND_URL:
			process.env.EXTERNAL_BACKEND_URL || 'http://localhost:1337',
		GIT_COMMIT: process.env.GIT_COMMIT,
		INTERNAL_BACKEND_URL:
			process.env.INTERNAL_BACKEND_URL || 'http://backend:1337',
	},
	output: 'standalone',
};
