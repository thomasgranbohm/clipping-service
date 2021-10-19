/** @type {import('next').NextConfig} */

const urls = [process.env.BACKEND_URL, process.env.NEXT_PUBLIC_BACKEND_URL].map(
	(url) => new URL(url).hostname
);

module.exports = {
	reactStrictMode: true,
	images: {
		domains: urls,
		minimumCacheTTL: 60,
		deviceSizes: [450, 640, 750, 828, 1080, 1200],
		imageSizes: [8, 16, 32, 48, 64, 96, 128, 256, 384],
	},
	publicRuntimeConfig: {
		imageDomains: urls,
	},
};
