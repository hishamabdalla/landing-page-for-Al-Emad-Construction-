// Service Worker for العماد Construction Company Website
const CACHE_NAME = 'nayzak-construction-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/images/logo.png',
    '/images/hero-bg.jpg',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', function(event) {
    console.log('[SW] Install event');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .catch(function(error) {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    console.log('[SW] Activate event');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
    // Skip non-HTTP requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    // Skip POST requests and external analytics
    if (event.request.method !== 'GET' || 
        event.request.url.includes('google-analytics') ||
        event.request.url.includes('facebook.net') ||
        event.request.url.includes('googletagmanager')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(function(cachedResponse) {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // Otherwise fetch from network
                console.log('[SW] Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then(function(response) {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone response for caching
                        const responseToCache = response.clone();

                        // Cache dynamic content (images, etc.)
                        if (event.request.url.includes('/images/') || 
                            event.request.url.includes('.jpg') ||
                            event.request.url.includes('.png') ||
                            event.request.url.includes('.svg')) {
                            
                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        return response;
                    })
                    .catch(function(error) {
                        console.error('[SW] Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // Return placeholder for images
                        if (event.request.url.includes('/images/')) {
                            return new Response(`
                                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100%" height="100%" fill="#f0f0f0"/>
                                    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">
                                        صورة غير متوفرة
                                    </text>
                                </svg>
                            `, {
                                headers: {
                                    'Content-Type': 'image/svg+xml',
                                    'Cache-Control': 'no-cache'
                                }
                            });
                        }
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', function(event) {
    console.log('[SW] Background sync event:', event.tag);
    
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(
            // Handle offline form submissions
            handleOfflineFormSubmissions()
        );
    }
});

// Push notification handling
self.addEventListener('push', function(event) {
    console.log('[SW] Push event received');
    
    const options = {
        body: 'لديك رسالة جديدة من مؤسسة العماد للمقاولات',
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        dir: 'rtl',
        lang: 'ar',
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'view',
                title: 'عرض',
                icon: '/images/icon-view.png'
            },
            {
                action: 'dismiss',
                title: 'إغلاق',
                icon: '/images/icon-dismiss.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('مؤسسة العماد للمقاولات', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', function(event) {
    console.log('[SW] Notification click event');
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle offline form submissions
function handleOfflineFormSubmissions() {
    return new Promise(function(resolve, reject) {
        // Get stored form data from IndexedDB or localStorage
        const offlineData = getOfflineFormData();
        
        if (offlineData.length === 0) {
            resolve();
            return;
        }

        // Attempt to send each stored submission
        const sendPromises = offlineData.map(function(formData) {
            return fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.ok) {
                    // Remove from offline storage
                    removeOfflineFormData(formData.id);
                }
                return response;
            });
        });

        Promise.all(sendPromises)
            .then(resolve)
            .catch(reject);
    });
}

// Utility functions for offline data management
function getOfflineFormData() {
    // In a real implementation, you would use IndexedDB
    try {
        const data = localStorage.getItem('offline-form-data');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function removeOfflineFormData(id) {
    try {
        const data = getOfflineFormData();
        const filteredData = data.filter(item => item.id !== id);
        localStorage.setItem('offline-form-data', JSON.stringify(filteredData));
    } catch (e) {
        console.error('Failed to remove offline form data:', e);
    }
}

// Cache management
function cleanupCache() {
    return caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.keys().then(function(requests) {
                const oldRequests = requests.filter(function(request) {
                    // Remove cached items older than 7 days
                    const cacheTime = new Date(request.headers.get('date') || 0);
                    const now = new Date();
                    const daysDiff = (now - cacheTime) / (1000 * 60 * 60 * 24);
                    return daysDiff > 7;
                });

                return Promise.all(
                    oldRequests.map(function(request) {
                        return cache.delete(request);
                    })
                );
            });
        });
}

// Periodic cache cleanup (called during activate)
self.addEventListener('activate', function(event) {
    event.waitUntil(
        Promise.all([
            cleanupCache(),
            // Other activation tasks
        ])
    );
});

// Error handling
self.addEventListener('error', function(event) {
    console.error('[SW] Error:', event.error);
});

self.addEventListener('unhandledrejection', function(event) {
    console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker loaded successfully');
