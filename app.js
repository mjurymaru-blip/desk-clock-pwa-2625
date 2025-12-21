/* ========================================
   置き時計PWA - アプリケーションロジック
   ======================================== */

// パターン管理
const patterns = ['simple', 'with-date', 'analog', 'minimal'];
let currentPatternIndex = 0;

// DOM要素
const clockContainer = document.getElementById('clockContainer');
const patternElements = document.querySelectorAll('.pattern');
const dots = document.querySelectorAll('.dot');
const hint = document.getElementById('hint');

// ========================================
// 時刻更新
// ========================================
function updateClock() {
    const now = new Date();

    // 時刻文字列（秒あり）
    const timeWithSeconds = now.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // 時刻文字列（秒なし）
    const timeWithoutSeconds = now.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // 日付文字列
    const dateStr = now.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
    });

    // パターン1: シンプル
    const timeSimple = document.getElementById('time-simple');
    if (timeSimple) timeSimple.textContent = timeWithSeconds;

    // パターン2: 日付付き
    const timeDate = document.getElementById('time-date');
    const dateEl = document.getElementById('date');
    if (timeDate) timeDate.textContent = timeWithSeconds;
    if (dateEl) dateEl.textContent = dateStr;

    // パターン3: アナログ
    updateAnalogClock(now);

    // パターン4: ミニマル
    const timeMinimal = document.getElementById('time-minimal');
    if (timeMinimal) timeMinimal.textContent = timeWithoutSeconds;
}

// アナログ時計の針を更新
function updateAnalogClock(now) {
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 角度計算
    const hourDeg = (hours * 30) + (minutes * 0.5); // 360/12 = 30度/時間
    const minuteDeg = (minutes * 6) + (seconds * 0.1); // 360/60 = 6度/分
    const secondDeg = seconds * 6; // 360/60 = 6度/秒

    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;
}

// ========================================
// パターン切り替え
// ========================================
function switchPattern(index) {
    // インデックス正規化
    if (index < 0) index = patterns.length - 1;
    if (index >= patterns.length) index = 0;

    currentPatternIndex = index;

    // パターン表示切り替え
    patternElements.forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    // インジケーター更新
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    // パターンをローカルストレージに保存
    localStorage.setItem('clockPattern', index);
}

// ========================================
// テーマ切り替え
// ========================================
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('lightTheme', isLight);
}

// ========================================
// 全画面切り替え
// ========================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('全画面モードに切り替えできませんでした:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// ========================================
// タッチ/スワイプ操作
// ========================================
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let lastTapTime = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const diffTime = touchEndTime - touchStartTime;

    // スワイプ判定（水平方向に50px以上、300ms以内）
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) && diffTime < 300) {
        if (diffX > 0) {
            // 右スワイプ: 前のパターン
            switchPattern(currentPatternIndex - 1);
        } else {
            // 左スワイプ: 次のパターン
            switchPattern(currentPatternIndex + 1);
        }
        return;
    }

    // ダブルタップ判定（300ms以内に2回タップ）
    const tapTime = Date.now();
    if (tapTime - lastTapTime < 300) {
        toggleFullscreen();
        lastTapTime = 0;
        return;
    }
    lastTapTime = tapTime;

    // シングルタップ（少し待ってから判定）
    setTimeout(() => {
        if (lastTapTime === tapTime) {
            // テーマ切り替え
            toggleTheme();
        }
    }, 300);
});

// マウスでのダブルクリック
document.addEventListener('dblclick', (e) => {
    // ドットをクリックした場合は除外
    if (e.target.classList.contains('dot')) return;
    toggleFullscreen();
});

// シングルクリック（PCの場合）
document.addEventListener('click', (e) => {
    // ドットをクリックした場合は除外
    if (e.target.classList.contains('dot')) return;
    // 少し遅延してダブルクリックでないか確認
    // （タッチデバイスでは別途処理しているのでPCのみ）
});

// インジケーターのドットクリック
dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
        e.stopPropagation();
        switchPattern(index);
    });
});

// キーボード操作
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            switchPattern(currentPatternIndex - 1);
            break;
        case 'ArrowRight':
            switchPattern(currentPatternIndex + 1);
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 't':
        case 'T':
            toggleTheme();
            break;
        case 'Escape':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
});

// ========================================
// 初期化
// ========================================

// Wake Lock（画面常時点灯）
let wakeLock = null;
let noSleepVideo = null;

// 動画再生によるロック防止（バックアップ策）
function enableVideoLock() {
    if (noSleepVideo) return; // 既に有効なら何もしない

    // 無音の動画データ（1px黒色webm）
    const webm = 'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmRBfX1FPM2lniZ0xIi4VEZo4xO17EAAAAAAABAAAAAAAAAAAAAAAABtDAgIGBAQAAAAEAAACgwIEDQUIGAoADQ4IEA4KCAgKDAgQEAgIEAwEBAQAAAAAAZoFnQYtAAACAiZ0xIi4VEZo4xO17EAMAAAAAAABAAAAAAAAAAAAAAABAAAABAAAAAAAQ7Z1AAACAv50xIi4VEZo4xO17EAMAAAAAAABAAAAAAAAAAAAAAABAAAAHgAAAAB1foICAgQQAQAAACQAAAGkAAAAAAAAAAAAAAADEAAAAAAAAAAAAAAACAAAAAA==';

    noSleepVideo = document.createElement('video');
    noSleepVideo.setAttribute('playsinline', '');
    noSleepVideo.setAttribute('muted', '');
    noSleepVideo.setAttribute('loop', '');
    noSleepVideo.src = webm;
    noSleepVideo.style.display = 'none'; // 非表示

    // 再生試行
    noSleepVideo.play().then(() => {
        console.log('Video Lock: 有効化（動画再生中）');
    }).catch((err) => {
        console.log('Video Lock: 再生失敗 -', err);
        noSleepVideo = null; // 失敗したらリセット
    });
}

async function requestWakeLock() {
    // 1. Wake Lock API (HTTPS/Localhost用)
    if ('wakeLock' in navigator) {
        if (wakeLock === null) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('Wake Lock: 画面常時点灯を有効化');

                wakeLock.addEventListener('release', () => {
                    wakeLock = null;
                    console.log('Wake Lock: 解除されました');
                });
            } catch (err) {
                console.log('Wake Lock: 利用できません -', err.message);
            }
        }
    }

    // 2. 動画再生ハック (HTTP/古い端末用)
    // ユーザーアクション（タップ）が必要なので、イベントリスナー経由で呼ばれることを想定
    enableVideoLock();
}

// 画面再表示時やタップ時にWake Lockを再取得
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        requestWakeLock();
    }
});

const handleUserInteraction = () => {
    requestWakeLock();
    // 一度動画ロックが成功したらリスナーを削除してもいいが、
    // Wake Lock APIの再取得もあるので残しておく
};

document.addEventListener('click', handleUserInteraction);
document.addEventListener('touchstart', handleUserInteraction);

// PWAとして起動したかチェック
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches
        || window.matchMedia('(display-mode: fullscreen)').matches
        || window.navigator.standalone === true;
}

// 全画面を自動で要求（ユーザー操作時）
function setupAutoFullscreen() {
    // PWAとして起動している場合は全画面不要（既にフルスクリーン）
    if (isPWA()) {
        console.log('PWAモードで起動中');
        return;
    }

    // ブラウザで開いている場合、初回タップで全画面を促す
    let hasRequestedFullscreen = false;

    const requestFullscreenOnce = () => {
        if (!hasRequestedFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
            hasRequestedFullscreen = true;
        }
    };

    // 画面タップ時に全画面リクエスト（初回のみ）
    document.addEventListener('touchstart', requestFullscreenOnce, { once: true });
}

function init() {
    // 保存されたテーマを復元
    const savedTheme = localStorage.getItem('lightTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('light-theme');
    }

    // 保存されたパターンを復元
    const savedPattern = localStorage.getItem('clockPattern');
    if (savedPattern !== null) {
        switchPattern(parseInt(savedPattern, 10));
    }

    // 時計を開始
    updateClock();
    setInterval(updateClock, 1000);

    // ヒントを数秒後に非表示にするアニメーション
    setTimeout(() => {
        if (hint) hint.style.opacity = '0.5';
    }, 5000);

    // 画面常時点灯を有効化
    requestWakeLock();

    // 自動全画面セットアップ
    setupAutoFullscreen();
}

// Service Worker登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// 初期化実行
init();
