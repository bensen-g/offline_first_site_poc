const cacheName = 'your-app-cache-v1';
const staticAssets = [
    '/',
    '/static/css/style.css',
    '/static/css/bootstrap.min.css',
    '/static/js/bootstrap.min.js',
    '/static/js/project.js',
    '/static/js/tasks.js',
    // Add other static files here
];

self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    self.clients.claim();
});

self.addEventListener('fetch', async event => {
    const req = event.request;
    const url = new URL(req.url);

    console.log(navigator.onLine)
    if (!navigator.onLine) {
        console.log('from cache')
        event.respondWith(cacheFirst(req));
    } else {
        console.log('from network first and then cache')
        event.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}