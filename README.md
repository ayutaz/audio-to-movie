# Audio to Movie Converter

多様な音声フォーマットのファイルを動画に変換し、YouTubeやXに最適化されたフォーマットでダウンロードできるWebサービスです。

## 技術スタック

- **Frontend**: Remix
- **Backend**: Hono
- **Platform**: Cloudflare Workers/Pages
- **Language**: TypeScript

## 機能

- 音声ファイルのアップロード（14種類のフォーマット対応）
- 音声波形の可視化
- YouTube/X最適化動画の生成
- 動画ファイルのダウンロード

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

### 3. ビルド

```bash
npm run build
```

### 4. Cloudflareへのデプロイ

```bash
npm run deploy
```

## 使用方法

1. ブラウザでアプリケーションにアクセス
2. 音声ファイルを選択してアップロード
3. "Convert to Video" ボタンをクリック
4. 生成された動画がダウンロードされます

## 対応フォーマット

### 入力（音声ファイル）
- **一般的なフォーマット**: MP3, WAV, M4A, AAC
- **高品質フォーマット**: FLAC, AIFF
- **圧縮フォーマット**: OGG, OPUS
- **その他**: WMA, AU, 3GP, AMR, MP2, AC3

**ファイルサイズ制限**: 最大50MB

### 出力
- MP4 (H.264, 1920x1080, 30fps)
- YouTube/X最適化設定

## ファイル構造

```
├── app/
│   ├── routes/
│   │   ├── _index.tsx          # メインページ
│   │   └── api.process.tsx     # 音声処理API
│   └── root.tsx                # アプリルート
├── server.js                   # Honoサーバー設定
├── remix.config.js            # Remix設定
├── vite.config.ts             # Vite設定
├── wrangler.toml              # Cloudflare Workers設定
└── package.json
```

## 環境変数

現在は環境変数は不要ですが、将来的に外部APIを使用する場合は `wrangler.toml` に追加してください。

## 注意事項

- Cloudflare Workersの実行時間制限（CPU時間10秒）により、長い音声ファイルの処理には制限があります
- 現在の実装は基本的な波形可視化のみです。より高度な可視化が必要な場合は追加の実装が必要です

## 今後の改善点

- より高度な音声可視化（スペクトログラム、3D波形など）
- 複数の動画テンプレート
- カスタム背景画像のアップロード
- 音声解析による自動的な可視化最適化