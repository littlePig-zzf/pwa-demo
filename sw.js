var cacheStorageKey = 'minimal-pwa-56'

var cacheList = [
  '/',
  "index.html",
  "main.css",
  "e.jpg"
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        return response
      }
      return fetch(e.request.url)
    })
  )
})

self.addEventListener('notificationclick', event => {
	const data = event.notification.data;
	console.log('data');
	console.log(data);
    let promiseChain = Promise.resolve();
    if (!event.action) {
        // 没有点击在按钮上
        console.log('Notification click.');
        // data 中有跳转页面信息则安排跳转
        if (data && data.page) {
            promiseChain = clients.openWindow(data.page);
        }

        return;
    }

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclose', event => {
    console.log('notificationclose');
});