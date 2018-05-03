var cacheStorageKey = 'minimal-pwa-75'

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


// 接收通知并与之互动
self.addEventListener('push', function(event) {
    console.log('get push');
    var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
    var title = '测试通知！！';

    event.waitUntil(
        // 接收到通知后，显示
        self.registration.showNotification(title, {
            body: payload.msg,
            url: payload.url,
            icon: payload.icon
        })
    );
});

// 处理通知的点击事件
self.addEventListener('notificationclick', function(event) {
    console.log('notificationclick');
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url == '/' && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow('http://localhost:8080/sport.html');
            }
        })
    );
    event.notification.close();
});



// 对应单纯客户端发起通知的对应操作

// self.addEventListener('notificationclick', event => {
// 	const data = event.notification.data;
// 	console.log('data');
// 	console.log(data);
//     let promiseChain = Promise.resolve();
//     if (!event.action) {
//         // 没有点击在按钮上
//         console.log('Notification click.');
//         // data 中有跳转页面信息则安排跳转
//         if (data && data.page) {
//             promiseChain = clients.openWindow(data.page);
//         }

//         return;
//     }

//     event.waitUntil(promiseChain);
// });

// self.addEventListener('notificationclose', event => {
//     console.log('notificationclose');
// });