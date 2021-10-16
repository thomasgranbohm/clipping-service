/** @type {import('next').NextConfig} */

const urls = [process.env.BACKEND_URL, process.env.NEXT_PUBLIC_BACKEND_URL].map(
	(url) => new URL(url).hostname
);

module.exports = {
	reactStrictMode: true,
	images: {
		domains: urls,
		deviceSizes: [1080, 1024, 720, 512, 256, 128, 64, 32, 16],
	},
	publicRuntimeConfig: {
		imageDomains: urls,
	},
};
