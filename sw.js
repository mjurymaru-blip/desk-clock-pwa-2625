/* ========================================
   置き時計PWA - Service Worker
   オフライン動作を可能にする
   ======================================== */

const CACHE_NAME = 'desk-clock-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// インストール時: キャッシュにファイルを保存
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('キャッシュを開きました');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// アクティベーション時: 古いキャッシュを削除
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('古いキャッシュを削除:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// フェッチ時: キャッシュファーストで返す
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュにあればそれを返す
                if (response) {
                    return response;
                }
                // なければネットワークから取得
                return fetch(event.request);
            })
            .catch(() => {
                // オフラインでキャッシュもない場合
                console.log('オフラインでリソースを取得できません:', event.request.url);
            })
    );
});
