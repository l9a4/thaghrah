
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('thaghrah-v3').then(cache =>
      cache.addAll([
        '/',
        '/css/style.css',
        '/js/theme.js',
        '/js/menu.js',
        '/js/auth-form.js',
        '/js/sw-register.js',
        '/js/submit.js',
        '/assets/cyber-bg.mp4',
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml'
      ])
    )
  );
});
self.addEventListener('activate', event => {
  const current = 'thaghrah-v3';
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== current).map(k => caches.delete(k)))
    )
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
