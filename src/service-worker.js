const CACHE_NAME = 'vayra-v1.0.0';
const STATIC_CACHE = 'vayra-static-v1';
const DYNAMIC_CACHE = 'vayra-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/apple-touch-icon.png',
];

// Routes to cache for offline access
const OFFLINE_ROUTES = [
  '/',
  '/dashboard',
  '/pricing',
  '/about',
  '/signin',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request);
      })
  );
});

// Handle API requests with offline queue
function handleApiRequest(request) {
  return fetch(request)
    .then((response) => {
      // Cache successful API responses
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
      return response;
    })
    .catch(() => {
      // Return offline response for API requests
      return new Response(
        JSON.stringify({ 
          error: 'offline', 
          message: 'You are offline. Changes will be synced when you reconnect.' 
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    });
}

// Handle static assets
function handleStaticAsset(request) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }
      return fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        });
    });
}

// Handle navigation requests
function handleNavigation(request) {
  return fetch(request)
    .then((response) => {
      // Cache successful navigation responses
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
      return response;
    })
    .catch(() => {
      // Return offline page for navigation requests
      return caches.match('/')
        .then((response) => {
          if (response) {
            return response;
          }
          // Fallback offline page
          return new Response(
            `
            <!DOCTYPE html>
            <html>
              <head>
                <title>VAYRA - Offline</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0; padding: 20px; background: #f9fafb; color: #374151;
                    display: flex; align-items: center; justify-content: center; min-height: 100vh;
                  }
                  .container { text-align: center; max-width: 400px; }
                  .icon { font-size: 48px; margin-bottom: 20px; }
                  h1 { margin: 0 0 10px 0; color: #111827; }
                  p { margin: 0 0 20px 0; color: #6b7280; }
                  .retry { 
                    background: #3b82f6; color: white; border: none; padding: 12px 24px;
                    border-radius: 8px; cursor: pointer; font-size: 16px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="icon">📱</div>
                  <h1>You're Offline</h1>
                  <p>Please check your internet connection and try again.</p>
                  <button class="retry" onclick="window.location.reload()">Retry</button>
                </div>
              </body>
            </html>
            `,
            {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'text/html' }
            }
          );
        });
    });
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get offline queue from IndexedDB
    const offlineQueue = await getOfflineQueue();
    
    if (offlineQueue.length === 0) {
      console.log('Service Worker: No offline data to sync');
      return;
    }

    console.log('Service Worker: Syncing offline data:', offlineQueue.length, 'items');

    // Process each queued action
    for (const action of offlineQueue) {
      try {
        await processOfflineAction(action);
        await removeFromOfflineQueue(action.id);
      } catch (error) {
        console.error('Service Worker: Error syncing action:', action.id, error);
      }
    }

    // Notify clients that sync is complete
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: { syncedItems: offlineQueue.length }
        });
      });
    });

  } catch (error) {
    console.error('Service Worker: Error during background sync:', error);
  }
}

// Get offline queue from IndexedDB
async function getOfflineQueue() {
  // This would be implemented with IndexedDB
  // For now, return empty array
  return [];
}

// Process offline action
async function processOfflineAction(action) {
  // This would process the actual API calls
  // For now, just log the action
  console.log('Service Worker: Processing offline action:', action);
}

// Remove action from offline queue
async function removeFromOfflineQueue(actionId) {
  // This would remove from IndexedDB
  // For now, just log
  console.log('Service Worker: Removed action from queue:', actionId);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from VAYRA',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('VAYRA', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/dashboard')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});
