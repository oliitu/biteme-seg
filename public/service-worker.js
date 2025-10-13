self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Installed');
    e.waitUntil(
      caches.open('biteme-v1').then((cache) => {
        return cache.addAll([
            '/',
            '/index.html',
            '/manifest.json',
            '/icons/web-app-manifest-192x192.png',
            '/icons/web-app-manifest-512x512.png'
          ]);
          
      })
    );
  });
  
  self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((res) => res || fetch(e.request))
    );
  });
  