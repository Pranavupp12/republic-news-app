self.addEventListener('push', function (event) {
  console.log('SW: Push Received!'); // <--- Debug Log 1

  if (event.data) {
    const data = event.data.json();
    console.log('SW: Data received:', data); // <--- Debug Log 2

    const options = {
      body: data.body,
      icon: data.image || '/logo/icon-192x192.png', 
      image: data.image || undefined,
      badge: '/logo/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
        .then(() => console.log('SW: Notification shown!')) // <--- Debug Log 3
        .catch((err) => console.error('SW: Show Notification Error:', err))
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});