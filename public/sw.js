// This is a basic service worker file.
// You can add caching strategies, push notification logic, etc. here.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Perform install steps
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching...');
  // Respond with cached resources or fetch from network
  event.respondWith(fetch(event.request));
});
