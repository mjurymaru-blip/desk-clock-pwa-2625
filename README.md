# Desk Clock PWA

シンプルで実用的な置き時計PWAアプリです。
TrueNAS ScaleやGitHub Pagesでの利用を想定しています。

> [!IMPORTANT]
> **Privacy Note**
> This repository and deployed site are for **personal use only**.
> - Search indexing is disabled (`noindex`).
> - Please keep the URL private if deployed publicly.

## Features
- **4 Display Patterns**: Simple, Date, Analog, Minimal
  - 日付付き（時刻 + 日付・曜日）
  - アナログ風（円形のアナログ時計）
  - ミニマル（時:分のみ）

- 🌙 **ダーク/ライトテーマ切り替え**
- 📺 **全画面モード対応**
- 📱 **ホーム画面に追加可能**
- ⚡ **オフライン動作**

## 操作方法

| 操作 | 動作 |
|------|------|
| 左右スワイプ | パターン切り替え |
| 左上の ⚙️ アイコン | 設定メニュー表示（フォント変更） |
| タップ (時計部) | テーマ切り替え（ダーク/ライト） |
| ダブルタップ | 全画面モード切り替え |
| 下部の ● をクリック | 指定のパターンに直接切り替え |
| ← → キー | パターン切り替え |
| F キー | 全画面モード切り替え |
| T キー | テーマ切り替え |

## ローカルで実行

```bash
# Python 3の場合
python3 -m http.server 8080

# または Node.js の場合
npx serve .
```

ブラウザで `http://localhost:8080` にアクセス

## Androidにインストール

1. Chromeで上記URLにアクセス
2. メニュー → 「ホーム画面に追加」を選択
3. アプリとして起動可能に！

## ファイル構成

```
desk-clock-pwa/
├── index.html      # メインHTML
├── style.css       # スタイル定義
├── app.js          # アプリケーションロジック
├── manifest.json   # PWA設定
├── sw.js           # Service Worker（オフライン対応）
├── icons/          # アプリアイコン
│   ├── icon-192.png
│   └── icon-512.png
└── README.md       # このファイル
```

## ライセンス

MIT License
