const CACHE_NAME = 'clipping-service-v1';
// TODO: Add versioning...

const icons = [
	'/icons/icon-192x192.png',
	'/icons/icon-256x256.png',
	'/icons/icon-384x384.png',
	'/icons/icon-512x512.png',
];

const IMAGE_REGEX = /\/_next\/image(.*?)q=1/;

self.addEventListener('install', (event) => {
	console.log('Installed!');
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(icons)));
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

					if (IMAGE_REGEX.compile().test(response.url)) {
						const responseToCache = response.clone();

						caches.open(CACHE_NAME).then(function (cache) {
							cache.put(event.request, responseToCache);
						});
					}

					return response;
				});
			})
			.catch((err) => console.error(err))
	);
});
