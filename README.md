# X Media Collector (Windows + iPhone完結版)

> **費用0円で進めたい場合は `FREE_BUILD_GUIDE.md` を参照してください。**
> こちらのREADMEはApple Developer Program($99/年)を使う場合の手順です。


Mac不要、Windows PC + iPhoneのみで動かすためのReact Native/Expoアプリです。
EAS Build（クラウドビルド）で.ipaを生成し、AltStore（Windows対応）でiPhoneに
サイドロードします。

## 全体の流れ
1. Windows PCで開発環境を準備
2. コードを配置してEAS Buildでクラウドビルド → .ipa取得
3. Windows用AltServerでiPhoneにインストール

---

## 1. Windows PCの準備

1. [Node.js](https://nodejs.org/)（LTS版）をインストール
2. PowerShellやコマンドプロンプトで確認:
   ```
   node -v
   npm -v
   ```
3. Expo CLIとEAS CLIをインストール:
   ```
   npm install -g eas-cli
   ```
4. Expoアカウントを作成（[expo.dev](https://expo.dev)、無料）してログイン:
   ```
   eas login
   ```

## 2. プロジェクトのセットアップ

1. 新規フォルダを作り、このzip内のファイル一式
   （`App.js`, `app.json`, `eas.json`, `package.json`, `src/` フォルダ）を配置
2. フォルダ内で依存パッケージをインストール:
   ```
   npm install
   ```
3. `app.json` の `ios.bundleIdentifier` を自分独自の値に変更
   （例: `com.yamada.xmediacollector`。他人と重複しなければ何でも可）
4. 動作確認したい場合（任意・Mac不要）:
   ```
   npx expo start
   ```
   iPhoneに「Expo Go」アプリを入れてQRコードを読み込めば、ビルド前でも
   動作確認ができます（この段階ではEAS Buildは不要）。

## 3. Apple Developer Program登録

1. https://developer.apple.com/programs/ で登録（年額$99）
2. 登録完了まで数時間〜1日かかる場合があります

## 4. EAS Buildでビルド

1. プロジェクト初期化:
   ```
   eas build:configure
   ```
   （iOSを選択。`app.json`のprojectIdが自動的に埋まります）
2. ビルド実行:
   ```
   eas build --platform ios --profile preview
   ```
3. 初回はApple IDでのログインを求められます。指示に従って認証すると、
   EAS側が自動的に証明書・プロビジョニングプロファイルを作成します
4. ビルドはクラウド上（Expo運営のMacサーバー）で行われるため、
   Windows PCだけで完結します。数分〜十数分待つと完了し、
   `.ipa` ファイルのダウンロードリンクが表示されます
5. `.ipa` をWindows PCにダウンロード

## 5. AltStoreでiPhoneにインストール

1. Windows PCに [AltServer (Windows版)](https://altstore.io/) をインストール
   （インストール時にiTunes/Apple Mobile Device Supportも必要になるので、
   案内に従ってインストールしてください）
2. iPhoneをUSBケーブルでPCに接続（初回は信頼するに設定）
3. タスクトレイのAltServerアイコンから
   「Install AltStore → （自分のiPhone名）」を選択し、Apple IDでログイン
4. iPhone本体で「設定 → 一般 → VPNとデバイス管理」から
   自分のApple IDのプロファイルを信頼する
5. iPhoneのAltStoreアプリを開き、「My Apps」→ ＋ボタンから
   ダウンロードしておいた `.ipa` ファイルを選択してインストール

## 6. 7日ごとの自動更新について

無料/通常のApple IDで署名されたアプリは7日で期限切れになります。
AltServerがPC上で常駐し、iPhoneと同じWi-Fiに接続されていれば
自動でリフレッシュされます。PCを頻繁にシャットダウンする場合は、
その都度AltStoreアプリを開いて手動リフレッシュしてください。

（Apple Developer Programの有料登録をしていれば、この7日制限自体は
AltStore経由でも変わりません。7日制限を無くすには本来はApp Store配布
または企業向け証明書が必要ですが、個人利用の範囲外になるため
ここでは扱いません。）

## 使い方

1. アプリを開き「アカウント」タブで収集したい@ユーザー名を登録
2. 「ブラウザ」タブでX (x.com) にログインし、登録アカウントの
   投稿があるページを普段通り閲覧
3. 表示されたツイートから自動でメディアが検出・保存される
4. 「ギャラリー」タブで一覧確認、フィルタも可能
5. サムネイルタップで元ツイートを開く

## トラブルシューティング

- **ビルドが失敗する**: `eas build:configure` からやり直す、
  またはApple Developer Programの登録が完了しているか確認
- **AltStoreでインストールできない**: iPhoneの信頼設定、
  AltServerとiPhoneが同一Wi-Fiにあるか確認
- **メディアが収集されない**: Xのページ構造変更の可能性。
  `src/injectedScript.js` のセレクタ調整が必要な場合あり
