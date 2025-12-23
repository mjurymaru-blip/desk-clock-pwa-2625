# Desk Clock PWA

シンプルで実用的な置き時計PWAアプリです。
TrueNAS ScaleやGitHub Pagesでの利用を想定しています。

> [!IMPORTANT]
> **Privacy Note**
> This repository and deployed site are for **personal use only**.
> - Search indexing is disabled (`noindex`).
> - Please keep the URL private if deployed publicly.

## Features
- **5 Display Patterns**: Simple, Date, Analog, Minimal, Hourglass (Background Fill)
  - **日付付き**: 時刻 + 日付・曜日
  - **アナログ風**: 円形のアナログ時計
  - **ミニマル**: 時:分のみの極小表示
  - **砂時計 (没入モード)**: 背景が光で満たされる抽象的な時間表現。**デフォルトでは時刻数字を隠し**、タップ時のみ表示されます。画面端には終わりを予感させる「基準線」があります。

- 🍃 **「静かな時間」の演出**:
  - **Dynamic Day/Night**: 24時間かけて背景色が移ろいます。**深夜（0:00-5:00）**は深い青色に固定され、静寂を演出します。
  - **Breathe**: 文字の発光がゆっくりと呼吸するように明滅します。深夜帯は振幅がさらに小さくなります。
  - **Ripple**: 15分ごとに画面に静かな波紋が広がります。
  - **Smooth Transitions**: パターン切り替え時に、別の時間の見方へ潜るようなフェード＆スケールアニメーションが適用されます。

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
| **タップ (砂時計モード中)** | **時刻数字を2秒間だけ表示** |
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
