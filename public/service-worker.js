service-worker.js

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('thaghrah-v1').then(cache =>
      cache.addAll(['/', '/css/style.css', '/assets/cyber-bg.mp4'])
    )
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});


