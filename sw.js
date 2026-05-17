const CACHE_NAME = 'g-school-v2';

// 1. 安裝時直接跳過等待，立刻讓最新的快取晶片就位
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. 激活時立刻接管網頁控制權，並清除所有舊世紀的快取垃圾
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('正在清理舊快取:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. 🎯【網絡攔截優化】教材走綠色通道，不進行頑固死快取，確保 data.json 隨更隨新
self.addEventListener('fetch', (event) => {
    // 讓所有請求直接走網路索取最新資料，如果網路斷開，再嘗試抓基本骨架
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
