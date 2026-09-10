const CACHE = "shorecast-emergency-v1";
const EMERGENCY_API = "http://localhost:8000/api/sos/offline-cache";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
  // Try to pre-cache emergency data for current location
  if ("geolocation" in self) {
    // Background sync will handle this
  }
});

// Cache emergency contacts on fetch
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("/api/sos/offline-cache")) {
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
  }
});

// Handle SOS notification actions
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "sos") {
    const { lat, lon } = e.notification.data || {};
    e.waitUntil(clients.openWindow(`/emergency?lat=${lat}&lon=${lon}`));
  } else {
    e.waitUntil(clients.openWindow("/emergency"));
  }
});
