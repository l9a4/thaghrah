self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('thaghrah-v1').then(cache =>
      cache.addAll(['/', '/css/style.css', '/assets/cyber-bg.mp4', '/offline.html'])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(res => res || caches.match('/offline.html'))
    )
  );
});
