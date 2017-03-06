'use strict';

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(event.request.url);

  // Don't cache anything that is not on this origin.
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(caches.open('web-bluetooth').then(function (cache) {
    return cache.match(request).then(function (response) {
      var fetchPromise = fetch(request).then(function (networkResponse) {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
      // Return the response from cache or wait for network.
      return response || fetchPromise;
    });
  }));
});

//# sourceMappingURL=service-worker-compiled.js.map