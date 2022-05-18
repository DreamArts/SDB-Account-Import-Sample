# アカウントマスタ連携サンプル

## 本レポジトリについて

アカウントマスタ連携を動かすためのサンプルです。  
一連の流れなどは[アカウントマスタ連携ガイド](https://doc.support-dreamarts.com/SmartDB/Document/MasterGuide/AccountLink/latest/account/index.html)を確認してください。

※ SmartDB Basic プラン向け（ INSUITE を併用した SmartDB では動作しません。）  

## 動作環境

本サンプルに含まれているモジュールは以下の条件で動作することを確認しています。

- Node.js LTS 版  
  ※ 内部の処理が ECMAScript で記述されており、Node.js のバージョンによって動作しない可能性があります。そのため、以下のバージョン以降を利用することを必須条件とします。  
    - v14.17.x
    - v16.13.x（推奨）
- npm v8.3.0 以降（推奨）

### ディレクトリ構成

本サンプルを取得した初期状態は以下のようになっています。

```
.
├── README.md（本ファイル）
├── config.sample.json
├── data
│   └── .gitignore
├── export
│   └── .gitignore
├── exporter.js
├── importer.js
├── index.js
├── libs
│   ├── csv.js
│   ├── defn.js
│   ├── exec_exporter.js
│   ├── exec_importer.js
│   ├── listDirectoryFiles.js
│   ├── request_export.js
│   ├── request_import.js
│   ├── sync_waiter.js
│   ├── utils.js
│   └── validateConfig.js
└── package.json
```

プログラムが入っていないディレクトリとして初期状態で `data` ディレクトリが存在しています。このディレクトリは連携したい CSV ファイルを格納するためのディレクトリです。

### セットアップ手順

※ [Node.js](https://nodejs.org/ja/download/) のインストールは事前に行われているものとします。

1. 本レポジトリを取得し、保存したディレクトリまでコマンドラインで移動します。
2. `npm install` を実行し、本サンプルを動作するために必要なライブラリを取得します。
3. 設定ファイルの作成を行うため、保存したディレクトリの中にある `config.sample.json` を複製します。複製したものを `config.json` と名前を変更します。
4. `config.json` をエディタで開き、利用している SmartDB の情報に置き換えます。

#### config.json の設定内容

設定ファイル config.json は JSON フォーマットで定義されています。以下の表に記載されているキーと説明を確認の上、値の設定を行ってください。

| キー | 説明 |
|--|--|
| host | 利用している SmartDB のホスト名を入力してください。<br />`{your_host_name}` と記載されている箇所をお客様自身の環境名に変更してください。<br />例: example.smartdb.jp の場合は `{your_host_name}` 部分には `example` が入ります。 |
| accessToken | SmartDB システム管理画面から取得したシステムトークンを入力してください |
| withInactive | ログイン不能ユーザ、廃止グループを含めてエクスポートを行うか<br />未設定（未定義）の場合はログイン不能ユーザを含めてエクスポートを行います。 |


## コマンド一覧

- SmartDB へのインポート処理（アカウントマスタ連携）  
  `npm run import`
- SmartDB からエクスポート処理（アカウントマスタ情報が含まれる CSV ファイルのダウンロード）  
  `npm run export`

## インポート
### サンプル動作方法

1. data ディレクトリ以下に連携したいデータを追加します。ファイル名は以下の通りです。  
  なお、ファイル名は完全一致となっているため、 `users (1).csv` などのファイル名では正しく読み込まれません。
    | 連携対象機能名 | ファイル名 |
    |--|--|
    | ユーザ情報 CSV | users.csv |
    | グループ情報 CSV | groups.csv |
    | 所属情報 CSV | group_members.csv |
    | 組織ロール情報 CSV | group_roles.csv |
2. コマンドラインで複製した本プロジェクトのディレクトリまで移動し、 `npm run import` で実行します。

### メッセージ一覧

本サンプルを動かす上で、以下のメッセージが表示されます。以下に記載されているメッセージ及び種別を確認し、その上で対応を行ってください。

|メッセージ|種別|説明|
|--|--|--|
|ERROR: not found config.json|エラー|config.json が存在していない|
|ERROR: Invalid type of config|エラー|config.json の中身が正しくない（配列や文字列として認識されているなど）|
|ERROR: Invalid config data, not defined host and accessToken|エラー|SmartDB のホスト情報もしくはアクセストークンが指定されていない|
|ERROR: Invalid host at config data, please check start string is https:\/\/|エラー|ホストのフォーマットが異なっている（ https:\/\/ など通信プロトコルを含めた値を期待）|
|WARN: Not found of sync CSV file list|エラー|読み込む対象となる CSV ファイルが存在しない|
|Wait 30 sec|情報|CSV 連携の同期が行われているので 30 秒待機している<br />※ CSV 連携は非同期で行われるため、 30 秒ごとにステータスを確認しています|
|SUCCESS: Sync of csv files|情報|CSV 連携の同期が正常に終了した|
|WARN: Sync error, please check your SmartDB\'s admin page.|情報|CSV 連携の同期に失敗した<br />管理画面にエラー行や説明が掲載されているので、確認する|

### 注意事項

- 本サンプルはユーザ情報の CSV 連携を自動的に行うものですが、 CSV 連携成功時に**パスワード未設定のユーザに対してメールの送信は行われません**。  
  メール送信をするためには公開 WebAPI で「パスワード未設定ユーザの招待」処理を行うか、画面上からの操作が必要です。

## エクスポート

### 出力先

- 本サンプル直下の export ディレクトリに出力されます。
- 出力される CSV の文字コードは UTF-8 （ BOM あり）で出力されます。

### サンプル動作方法

1. コマンドラインで複製した本プロジェクトのディレクトリまで移動し、 `npm run export` を実行します。
2. `export` ディレクトリ以下に CSV ファイルが保存されていることを確認します。

## 備考

- ディレクトリと記載されている箇所はフォルダと同じです。
- 本アカウントマスタ連携サンプルはサポートの対象外となります。予めご了承ください。

---

Copyright DreamArts Corporation All Rights Reserved.
