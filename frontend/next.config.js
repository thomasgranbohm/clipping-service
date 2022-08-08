/** @type {import('next').NextConfig} */

const urls = [process.env.BACKEND_URL, process.env.NEXT_PUBLIC_BACKEND_URL].map(
	(url) => new URL(url).hostname
);

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
	},
	swcMinify: false,
};
