self.addEventListener('push', (ev) => {
  const data = ev.data.json();
  self.registration.showNotification(
    data.title,
    {
      body: data.body,
      icon: '/android-chrome-192x192.png',
    },
  );
});
