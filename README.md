# 🌍 Translate App

美しい黄色ベースのデザインを持つ、英語⇄日本語双方向翻訳アプリです。言語を自動検出して適切な方向に翻訳します。

## ✨ 特徴

- 🔄 **自動言語検出**: 英語・日本語を自動検出して双方向翻訳
- ⚡ **リアルタイム翻訳**: 入力1秒後に自動翻訳開始
- 🎨 **美しいUI**: 黄色ベースのモダンなグラデーションデザイン
- 🌍 **地球儀アイコン**: アニメーション付きの3D地球儀アイコン
- 📱 **レスポンシブ**: デスクトップ・モバイル両対応
- 🌟 **豊富なエフェクト**: ホバー・フォーカス・アニメーション効果

## 🚀 インストール・実行方法

このアプリは **Electronデスクトップアプリ** と **Web版** の両方で利用できます。

### 🖥️ Electronアプリとして実行

1. **依存関係をインストール**:
```bash
npm install
```

2. **アプリケーションを起動**:
```bash
npm start
```

### 🌐 Web版として実行

1. **Web版をビルド**:
```bash
npm run build:web
```

2. **ローカルサーバーで起動**:
```bash
npm run serve:web
```

3. **ブラウザでアクセス**: http://localhost:3000

### 🚀 Vercelにデプロイ

Web版をVercelにデプロイできます：

```bash
# Vercelにログイン
npx vercel login

# プロダクションデプロイ
npx vercel --prod --yes
```

デプロイ後は以下のURLでアクセス可能：
- **翻訳アプリ**: https://your-app.vercel.app/
- **プレゼンテーション**: https://your-app.vercel.app/slides

### 📦 単体アプリとしてビルド

#### 1. electron-builderをインストール
```bash
npm install --save-dev electron-builder
```

#### 2. package.jsonにビルド設定を追加
```json
{
  "scripts": {
    "build": "electron-builder",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.yourname.translate-app",
    "productName": "Translate App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!node_modules",
      "node_modules/electron/**/*"
    ],
    "mac": {
      "category": "public.app-category.productivity",
      "icon": "assets/icon.icns"
    },
    "win": {
      "icon": "assets/icon.ico"
    },
    "linux": {
      "icon": "assets/icon.png"
    }
  }
}
```

#### 3. ビルド実行
```bash
# macOS用アプリをビルド
npm run build:mac

# Windows用アプリをビルド（macOSでも可能）
npm run build:win

# Linux用アプリをビルド
npm run build:linux

# 全プラットフォーム用をビルド
npm run build
```

#### 4. アプリの配布
- ビルド完了後、`dist/`フォルダに実行可能なアプリが生成されます
- macOS: `.app`ファイル
- Windows: `.exe`ファイル
- Linux: `AppImage`ファイル

## 🎯 使い方

1. **英語→日本語翻訳**: 英語を入力すると自動的に日本語に翻訳
2. **日本語→英語翻訳**: 日本語を入力すると自動的に英語に翻訳
3. **言語ラベル**: 入力言語に応じてラベルが自動切り替え
4. **クリア機能**: 「クリア」ボタンで全てリセット

## 🛠 技術スタック

### 🖥️ デスクトップ版（Electron）
- **Electron** - デスクトップアプリ化
- **HTML/CSS/JavaScript** - フロントエンド
- **Google Translate API** - 翻訳エンジン
- **Global Shortcuts** - システム全体でのショートカット
- **IPC通信** - メイン・レンダラープロセス間通信

### 🌐 Web版
- **Pure HTML/CSS/JavaScript** - フレームワークレス
- **Google Translate API** - 翻訳エンジン（CORS制限あり）
- **Responsive Design** - モバイル対応
- **PWA対応** - プログレッシブWebアプリ機能

### 🎨 共通
- **SVG** - カスタム地球儀アイコン
- **CSS Animations** - 豊富なアニメーション効果
- **Gradient Design** - 美しい黄色グラデーション

## 📋 システム要件

- **macOS**: 10.11 El Capitan以降
- **Windows**: Windows 7以降
- **Linux**: Ubuntu 14.04以降
- **メモリ**: 512MB以上
- **インターネット接続**: 翻訳機能に必要

## ⚠️ 注意事項

- インターネット接続が必要です
- Google翻訳の無料APIを使用しているため、大量の翻訳には制限がある場合があります
- 初回起動時にセキュリティ警告が表示される場合がありますが、信頼できるアプリとして許可してください

## 🔧 カスタマイズ

### アイコンの変更
1. `assets/`フォルダを作成
2. 以下のファイルを配置:
   - `icon.icns` (macOS用、512x512px)
   - `icon.ico` (Windows用、256x256px)
   - `icon.png` (Linux用、512x512px)

### 配色の変更
`styles.css`の以下の部分を編集:
```css
background: linear-gradient(135deg, #ffd700 0%, #ffb347 50%, #ffa500 100%);
```

## 📊 プレゼンテーション

Claude Codeを使った開発体験を紹介するスライドを公開しています：

🎯 **[Claude Codeで翻訳アプリを作ってみた](https://translate-app-for-r5m7n6wk8-yoshiyuki-hisamatsus-projects.vercel.app/slides.html)**

### 📝 スライドの生成・デプロイ方法

#### 1. Marpでスライド生成
```bash
# Marp CLIをインストール
npm install -g @marp-team/marp-cli

# Markdownからスライド生成
marp claude-code-presentation.md --html --output slides.html
```

#### 2. Vercelにデプロイ
```bash
# Vercelにログイン
npx vercel login

# プロダクションデプロイ
npx vercel --prod --yes
```

スライドではClaude Codeの高速開発体験と、ChatGPTとの使い分けについて紹介しています。

## 🧪 テスト

このプロジェクトではPlaywrightを使用してElectronアプリの自動テストを実行しています。

### テストの実行方法

1. **テスト用依存関係のインストール**:
```bash
npm install --save-dev playwright @playwright/test
```

2. **テストの実行**:
```bash
# 全てのテストを実行
npx playwright test

# 特定のテストを実行
npx playwright test --grep "翻訳機能"

# HTMLレポートの表示
npx playwright show-report
```

### テストの構成

- `test-electron.js`: Electronアプリのメインテストファイル
- `playwright.config.js`: Playwright設定ファイル

### テスト項目

- ✅ **アプリケーション起動確認**: Electronアプリが正常に起動すること
- ✅ **UI要素の確認**: 全てのUI要素が正しく表示されること
- ✅ **英語→日本語翻訳**: 英語テキストが正しく日本語に翻訳されること
- ✅ **日本語→英語翻訳**: 日本語テキストが正しく英語に翻訳されること
- ✅ **言語自動検出**: 入力言語に応じてラベルが自動切り替えされること
- ✅ **クリア機能**: クリアボタンで全てのフィールドがリセットされること
- ✅ **UI操作**: フォーカス、プレースホルダー、読み取り専用属性の確認

### HTMLレポート機能

PlaywrightはリッチなHTMLレポートを生成します：

- 📊 **テスト結果の詳細表示**: 各テストの実行時間と結果
- 📸 **失敗時のスクリーンショット**: エラー発生時の画面キャプチャ
- 🎥 **実行トレース**: テストの実行過程を詳細に記録
- 📝 **エラーコンテキスト**: 失敗の詳細な情報とデバッグ情報

テスト実行後、`http://localhost:9323/`でHTMLレポートが自動で開きます。

### テスト結果の確認

詳細なテスト結果については、[TEST_RESULTS.md](TEST_RESULTS.md)を参照してください。

## 🤝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。