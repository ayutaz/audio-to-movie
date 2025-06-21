# 🎵 Audio to Movie Converter

多様な音声フォーマットのファイルを動画に変換し、YouTubeやXに最適化されたフォーマットでダウンロードできるWebアプリケーションです。

## 🌐 ライブデモ

**https://ayutaz.github.io/audio-to-movie/**

ブラウザで直接アクセスして、すぐに音声ファイルを動画に変換できます！

## ✨ 主な機能

- **🎧 多様な音声フォーマット対応**: MP3, WAV, OPUS, FLAC など14種類
- **🎬 動画変換**: 音声ファイルから1920x1080の高品質MP4動画を生成
- **🔇 サイレント処理**: 変換中に音声が再生されない（ユーザー体験を重視）
- **📺 プレビュー機能**: 生成された動画をブラウザで即座に確認
- **📊 波形可視化**: リアルタイムで動く美しいアニメーション波形
- **⚡ 高速変換**: 完全ブラウザベース、サーバー不要
- **📱 レスポンシブ**: PC・スマートフォン両対応

## 🎯 技術的特徴

- **完全クライアントサイド**: サーバー不要、プライバシー保護
- **Web Audio API**: 高度な音声処理とサイレント変換
- **MediaRecorder API**: ブラウザネイティブな動画生成
- **Canvas API**: リアルタイム波形アニメーション
- **GitHub Pages**: 簡単デプロイメント

## 📁 対応フォーマット

### 入力（音声ファイル）
- **一般的なフォーマット**: MP3, WAV, M4A, AAC
- **高品質フォーマット**: FLAC, AIFF
- **圧縮フォーマット**: OGG, OPUS
- **その他**: WMA, AU, 3GP, AMR, MP2, AC3

**ファイルサイズ制限**: 最大50MB

### 出力
- **フォーマット**: MP4 (H.264互換)
- **解像度**: 1920x1080 (Full HD)
- **フレームレート**: 30fps
- **音声**: 元の音声トラック付き
- **最適化**: YouTube/X投稿に最適

## 🚀 使用方法

### オンライン使用（推奨）
1. **https://ayutaz.github.io/audio-to-movie/** にアクセス
2. 音声ファイルを選択してアップロード
3. 「🎬 Convert to Video」ボタンをクリック
4. 変換完了後、プレビューで確認
5. 「📥 Download MP4 Video」で動画をダウンロード

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/ayutaz/audio-to-movie.git
cd audio-to-movie

# ブラウザでHTMLファイルを直接開く
open index.html
# または
open audio-to-video.html
```

## 📱 GitHub Pages デプロイ

このプロジェクトはGitHub Pagesで自動デプロイされます：

1. `main` ブランチにプッシュ
2. GitHub Actions が自動でビルド・デプロイ
3. 数分で https://ayutaz.github.io/audio-to-movie/ に反映

### 手動でGitHub Pagesを有効化する場合

1. GitHubリポジトリの **Settings** → **Pages**
2. **Source**: "Deploy from a branch"
3. **Branch**: "main" を選択、"/ (root)" を選択
4. **Save** をクリック

## 🛠️ 技術スタック

- **Frontend**: Pure HTML5 + CSS3 + JavaScript (ES6+)
- **Audio Processing**: Web Audio API
- **Video Generation**: MediaRecorder API + Canvas API
- **Hosting**: GitHub Pages
- **Browser Support**: Chrome, Firefox, Safari, Edge (モダンブラウザ)

## 📂 ファイル構造

```
├── index.html                  # GitHub Pages メインファイル
├── audio-to-video.html        # スタンドアロン版（同一内容）
├── standalone.html            # 簡易版（デモ用）
├── README.md                  # このファイル
├── package.json              # 旧Remix設定（参考用）
└── app/                      # 旧Remix実装（参考用）
    ├── routes/
    └── ...
```

## 🔧 カスタマイズ

### 動画設定の変更

`index.html` の以下の部分を編集：

```javascript
// 解像度変更
canvas.width = 1920;  // 幅
canvas.height = 1080; // 高さ

// フレームレート変更
const videoStream = canvas.captureStream(30); // 30fps

// 動画の長さ変更
const maxDuration = 5; // 最大5秒
```

### 波形スタイルの変更

```javascript
// 波形の色
ctx.strokeStyle = '#00ff88'; // 緑色

// 波形の太さ
ctx.lineWidth = 3;

// アニメーション速度
const time = (i + frameNumber * 2) / 50; // 2を変更
```

## 🎨 スクリーンショット

- ✅ ファイル選択UI
- ✅ リアルタイム進捗表示
- ✅ 動画プレビュー（音声付き）
- ✅ ダウンロード機能
- ✅ レスポンシブデザイン

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します！

1. フォークしてブランチを作成
2. 変更を実装
3. テストして動作確認
4. プルリクエストを作成

## 📄 ライセンス

MIT License

## 🔗 関連リンク

- **ライブデモ**: https://ayutaz.github.io/audio-to-movie/
- **GitHubリポジトリ**: https://github.com/ayutaz/audio-to-movie
- **イシュー報告**: https://github.com/ayutaz/audio-to-movie/issues

---

**🚀 今すぐ試す**: https://ayutaz.github.io/audio-to-movie/