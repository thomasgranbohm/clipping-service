/** @type {import('next').NextConfig} */

const urls = [process.env.BACKEND_URL, process.env.NEXT_PUBLIC_BACKEND_URL].map(
	(url) => new URL(url).hostname
);

module.exports = {
	reactStrictMode: true,
	images: {
		deviceSizes: [456, 768, 960, 1080, 1200, 1920, 2048],
		domains: urls,
		imageSizes: [1080, 1024, 720, 512, 384, 256, 128, 64, 32, 16, 8],
		minimumCacheTTL: 60,
	},
	publicRuntimeConfig: {
		imageDomains: urls,
	},
};
