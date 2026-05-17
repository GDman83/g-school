const CACHE_NAME = 'g-school-v1';

// 安裝時直接跳過等待
self.addEventListener('install', event => {
    self.skipWaiting();
});

// 啟用時立刻接管網頁
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// 網絡請求攔截（直接走網絡，防死卡快取）
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
