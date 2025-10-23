# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

音声ファイルを動画ファイル（MP4）に変換するWebアプリケーション。完全にブラウザ内で動作するクライアントサイドアプリケーションで、サーバー処理は不要。14種類の音声フォーマット（MP3, WAV, OPUS, FLAC等）に対応し、YouTube/X投稿に最適化された1920x1080、30fpsの動画を生成する。

**デプロイURL**: https://ayutaz.github.io/audio-to-movie/

## アーキテクチャ

### 現在の実装（メイン）

**Pure HTML/CSS/JavaScript** による完全クライアントサイド実装：

- **index.html**: GitHub Pagesのメインエントリポイント
- **audio-to-video.html**: index.htmlと同一内容のスタンドアロン版
- **standalone.html**: 簡易版（デモ用）

すべてのコードは単一HTMLファイル内に含まれる（CSS、JavaScript込み）。ビルドプロセス不要。

### 旧実装（参考用）

**app/** ディレクトリ内の Remix + Cloudflare Pages 実装は参考用として残されている。現在は使用されていないが、将来的なサーバーサイド実装の参考として保持。

## コア技術スタック

### 音声処理 (index.html:300-323)
- **Web Audio API** でサイレント処理
- `AudioContext` でデコード、スピーカー出力なしで録画用ストリームのみ作成
- `createMediaStreamDestination()` で MediaRecorder 用の音声トラックを生成

### 動画生成 (index.html:286-500)
- **Canvas API** (1920x1080) で各フレームを描画
- アニメーション波形を数学関数（sin波の組み合わせ）で生成
- **MediaRecorder API** で Canvas の `captureStream(30fps)` と音声ストリームを結合
- mimeType: 'video/mp4;codecs=avc1.42E01E' を優先、フォールバックあり

### 制約条件
- 最大ファイルサイズ: 50MB (index.html:266)
- 動画の長さ: 3-5秒（音声の長さに自動調整）(index.html:473)
- サポートフォーマット: `supportedFormats` 配列で定義 (index.html:197)

## 開発ワークフロー

### ローカル開発

```bash
# ブラウザで直接HTMLファイルを開く
open index.html
# または
open audio-to-video.html
```

ビルドプロセスは不要。HTMLファイルを直接編集してブラウザでリロード。

### テスト

モダンブラウザで動作を確認：
- Chrome/Edge（推奨）
- Firefox
- Safari

実際の音声ファイルで変換テストを実施：
1. 対応フォーマットのファイルをアップロード
2. 変換ボタンをクリック
3. 生成された動画プレビューを確認
4. ダウンロードした動画ファイルを再生確認

### GitHub Pages デプロイ

```bash
# mainブランチにプッシュで自動デプロイ
git add .
git commit -m "Update: description"
git push origin main
```

数分で https://ayutaz.github.io/audio-to-movie/ に反映される。

## カスタマイズポイント

### 動画パラメータ変更

**解像度** (index.html:289-290):
```javascript
canvas.width = 1920;   // 幅を変更
canvas.height = 1080;  // 高さを変更
```

**フレームレート** (index.html:392):
```javascript
const videoStream = canvas.captureStream(30); // fps値を変更
```

**動画の長さ** (index.html:472-473):
```javascript
const maxDuration = 5; // 最大秒数
const duration = Math.max(Math.min(audioDuration, maxDuration), 3); // 最小秒数
```

### 波形アニメーション変更

**波形の色** (index.html:356):
```javascript
ctx.strokeStyle = '#00ff88'; // カラーコードを変更
```

**波形の太さ** (index.html:357):
```javascript
ctx.lineWidth = 3; // ピクセル値を変更
```

**アニメーション速度** (index.html:363):
```javascript
const time = (i + frameNumber * 2) / 50; // 2の値で速度調整
```

**波形の複雑さ** (index.html:364):
```javascript
const amplitude = Math.sin(time) * 0.8
                + Math.sin(time * 3) * 0.3
                + Math.sin(time * 7) * 0.1; // sin波の組み合わせを調整
```

## 重要な実装詳細

### サイレント処理の仕組み

ブラウザの自動再生ポリシー対応のため、音声は以下のように処理される：
1. `AudioContext.decodeAudioData()` で音声をデコード（再生なし）
2. `createMediaStreamDestination()` で録画専用ストリームを作成
3. `AudioBufferSourceNode` を destination に接続（スピーカーには接続しない）
4. MediaRecorder で動画と音声を結合して録画

この方式により、ユーザーには音が聞こえないが、生成された動画には音声トラックが含まれる。

### ブラウザ互換性処理

mimeType の自動検出とフォールバック (index.html:436-446):
```javascript
// 優先順位:
// 1. video/mp4;codecs=avc1.42E01E
// 2. video/mp4
// 3. video/webm;codecs=h264
// 4. video/webm;codecs=vp9
// 5. video/webm (デフォルト)
```

### リソース管理

- `URL.createObjectURL()` で生成されたURLは必ず `URL.revokeObjectURL()` でクリーンアップ
- `AudioContext` は使用後に `close()` でクローズ (index.html:486-488)
- `beforeunload` イベントでリソース解放 (index.html:549-553)

## 注意事項

- **app/** ディレクトリの Remix コードは編集しない（参考用のみ）
- **package.json** の scripts は旧実装用のため、現在は使用されていない
- すべての変更は **index.html** と **audio-to-video.html** の両方に同期すること
- 動画生成は完全にクライアントサイドで実行されるため、重い処理になる可能性がある
- 50MBのファイルサイズ制限は、ブラウザメモリ制約を考慮した設定
