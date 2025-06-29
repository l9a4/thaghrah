
self.addEventListener('install', event => {
  event.waitUntil(
<<<<<<< HEAD
    caches.open('thaghrah-v7').then(cache =>
=======
    caches.open('thaghrah-v2').then(cache =>
>>>>>>> 0b138ea488091ac33686512198db1e2647a9691e
      cache.addAll([
        '/',
        '/css/style.css',
        '/js/theme.js',
        '/js/menu.js',
        '/js/auth-form.js',
<<<<<<< HEAD
        '/js/password-toggle.js',
        '/js/sw-register.js',
        '/js/submit.js',
        '/js/header.js',
        '/js/faq.js',
        '/js/draft.js',
        '/js/scroll-reveal.js',
=======
        '/js/sw-register.js',
>>>>>>> 0b138ea488091ac33686512198db1e2647a9691e
        '/assets/cyber-bg.mp4',
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml'
      ])
    )
  );
});
self.addEventListener('activate', event => {
<<<<<<< HEAD
  const current = 'thaghrah-v7';
=======
  const current = 'thaghrah-v2';
>>>>>>> 0b138ea488091ac33686512198db1e2647a9691e
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
