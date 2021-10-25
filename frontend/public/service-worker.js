const BASE_NAME = 'clipping-service-0.1.0';

const CACHES = [
	{
		name: `${BASE_NAME}-images`,
		regex: /\/_next\/image(.*?)q=1/,
		files: [
			'/icons/icon-192x192.png',
			'/icons/icon-256x256.png',
			'/icons/icon-384x384.png',
			'/icons/icon-512x512.png',
		],
	},
];

self.addEventListener('install', (event) => {
	console.log('Installed!');

	event.waitUntil(
		Promise.all(
			CACHES.map(({ files, name }) => {
				return caches.open(name).then((cache) => cache.addAll(files));
			})
		)
	);

	self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then((resp) => {
				if (resp) return resp;

				return fetch(event.request).then((response) => {
					if (
						!response ||
						response.status !== 200 ||
						response.type !== 'basic'
					) {
						return response;
					}

					for (const { name, regex } of CACHES) {
						if (regex.test(response.url)) {
							const responseToCache = response.clone();

							caches
								.open(name)
								.then((cache) => cache.put(event.request, responseToCache));
						}
					}

					return response;
				});
			})
			.catch((err) => console.error(err))
	);
});
