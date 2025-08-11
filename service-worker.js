
const CACHE = 'cartoony-mma-online-v12';
const ASSETS = ['index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k!==CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (u.origin === location.origin) {
    const path = u.pathname.split('/').pop();
    if (ASSETS.includes(path)) { e.respondWith(caches.match(path)); return; }
  }
  e.respondWith(fetch(e.request).catch(() => caches.match('index.html')));
});
