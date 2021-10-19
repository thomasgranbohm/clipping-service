const CACHE_NAME = 'clipping-service-v1';
// TODO: Add versioning...

const icons = [
	'/icons/icon-192x192.png',
	'/icons/icon-256x256.png',
	'/icons/icon-384x384.png',
	'/icons/icon-512x512.png',
];

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

				return fetch(event.request);
			})
			.catch((err) => console.error(err))
	);
});
