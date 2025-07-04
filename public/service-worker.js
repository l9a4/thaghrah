
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('thaghrah-v7').then(cache =>
    caches.open('thaghrah-v2').then(cache =>
      cache.addAll([
        '/',
        '/css/style.css',
        '/js/theme.js',
        '/js/menu.js',
        '/js/auth-form.js',
        '/js/password-toggle.js',
        '/js/sw-register.js',
        '/js/submit.js',
        '/js/header.js',
        '/js/faq.js',
        '/js/draft.js',
        '/js/scroll-reveal.js',
        '/js/sw-register.js',
        '/assets/cyber-bg.mp4',
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml'
      ])
    )
  );
});
self.addEventListener('activate', event => {
  const current = 'thaghrah-v7';
  const current = 'thaghrah-v2';
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
