# 完全無料ルート：GitHub Actions + AltStore

Apple Developer Program（$99/年）への登録なしで、Windows PC + iPhoneのみで
完結させる手順です。GitHub Actionsの無料クラウドMac環境でアプリを
「未署名」の状態でビルドし、AltServer（無料）が無料のApple IDを使って
署名・インストールします。

**費用：0円**（GitHubアカウント、Apple ID、AltStoreはすべて無料）

---

## 事前に知っておくこと

- 無料Apple IDで署名されたアプリは **7日で期限切れ** になります
  （これは有料アカウントでも同じ制限。$99を払ってもこの制限はなくなりません）
- AltServerをWindows PCで起動しておき、iPhoneと同じWi-Fiに繋がっていれば
  自動でバックグラウンド更新されます
- GitHub Actionsの無料枠：公開(public)リポジトリなら実質無制限、
  非公開(private)でも毎月十分な無料時間があります

---

## 1. GitHubアカウントとリポジトリの準備

1. https://github.com で無料アカウントを作成（すでにあれば不要）
2. 新規リポジトリを作成（Public推奨。個人情報は含まれないコードなので
   公開して問題ありません）
3. Windows PCに [Git for Windows](https://gitforwindows.org/) をインストール

## 2. プロジェクトをGitHubにアップロード

コマンドプロンプトまたはPowerShellで、このzipを展開したフォルダに移動して:

```
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main
```

（`.github/workflows/build-unsigned-ipa.yml` もこの中に含まれているので
自動的にアップロードされます）

## 3. app.json の bundleIdentifier を変更

`app.json` を開き、`ios.bundleIdentifier` を自分だけの値に変更してください
（例: `com.yamada.xmediacollector`）。変更後、再度コミット&プッシュ:

```
git add app.json
git commit -m "update bundle id"
git push
```

## 4. GitHub Actionsでビルド実行

1. GitHub上のリポジトリページで「Actions」タブを開く
2. 左側に表示される「Build unsigned iOS ipa」をクリック
3. 右側の「Run workflow」ボタン→再度「Run workflow」で実行開始
4. 10〜15分程度待つと緑のチェックマークで完了
5. 完了したワークフロー実行をクリックし、下部の「Artifacts」から
   `app-unsigned-ipa` をダウンロード（zipファイル、中に.ipaが入っています）

ビルドが失敗した場合はログを開いて確認してください。
「Detect workspace & scheme」のステップの出力（検出されたスキーム名）が
空になっている場合は、`app.json` の `name` を英数字のみに調整して
再実行してください。

## 5. AltServerのインストール（Windows）

1. https://altstore.io/ からWindows版AltServerをダウンロード・インストール
   （案内に従い、iTunes/Apple Mobile Device Supportも一緒にインストールされます）
2. インストール後、タスクトレイにAltServerのアイコンが常駐します

## 6. iPhoneへのインストール

1. iPhoneをUSBケーブルでPCに接続し、「このコンピュータを信頼」を選択
2. タスクトレイのAltServerアイコンを右クリック
3. 接続されているiPhoneの名前にカーソルを合わせ、
   「Install AltStore」を選択 → Apple ID/パスワードを入力
   （これは無料のApple IDでOK。新規に専用IDを作ることも推奨）
4. iPhone本体で「設定 → 一般 → VPNとデバイス管理」から
   自分のApple IDのプロファイルを信頼する
5. 再度AltServerを右クリック → 接続中のiPhone名 → 「Install .ipa」
   （※メニュー名はバージョンにより多少異なります。iPhone名の
   サブメニューに「Install」系の項目があります）
6. ダウンロードしておいた未署名の `.ipa` ファイルを選択
7. AltServerが自動で署名し、iPhoneにインストールされます

## 7. 継続利用（7日ごとの更新）

- AltServerをPCで起動したままにし、iPhoneを同じWi-Fiに接続していれば
  自動的にバックグラウンドでリフレッシュされます
- 手動で更新したい場合は、iPhone側のAltStoreアプリを開き
  「My Apps」からXMediaCollectorの「Refresh」をタップ
  （PCがAltServer経由で接続されている必要があります）

## 8. コードを更新したいとき

`src/injectedScript.js` などを修正した場合は、GitHubに再度push →
Actionsタブで再度「Run workflow」→ 新しい.ipaをダウンロード →
AltServerで再インストール、という流れになります。

---

## 使い方（アプリ側）

1. アプリを開き「アカウント」タブで収集したい@ユーザー名を登録
2. 「ブラウザ」タブでX (x.com) にログインし、登録アカウントの
   投稿があるページを普段通り閲覧
3. 表示されたツイートから自動でメディアが検出・保存される
4. 「ギャラリー」タブで一覧確認、フィルタも可能
5. サムネイルタップで元ツイートを開く
