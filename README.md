# ios-scriptable-project

このプロジェクトはiOSアプリ「Scriptable」のスクリプトを管理するためのプロジェクトです。

## 概要

[`Scriptable`](https://scriptable.app/)はiOS/iPadOS内のJavaScript実行環境です。
`Scriptable`を使っていると、`Scriptable`から`npm`パッケージを利用したいことも出てきます。
`Mac`でパッケージをバンドルしてモジュールを作れば利用できます。そのためのプロジェクトです。

## 必要なもの

* `Scriptable`アプリ。無料。[`Scriptable`](https://apps.apple.com/jp/app/scriptable/id1405459188)
* `iCloud`
* `Mac`と`VSCode`

`Scriptable`アプリで実行するスクリプトは`iCloud`を通して`Mac`からも編集できます。
それを利用して、`Mac`でモジュールをバンドルしたい。そのためのプロジェクトです。

## 使い方

`Scriptable`のスクリプトを書いている時に、`npm`パッケージを使いたいことがあります。
このプロジェクトを使って、バンドルされたモジュールを作成し、`Scriptable`から`importModule`でインポートできます。

1. このリポジトリをクローンする
2. 必要なシンボリックリンクを張る
   1. `dist`: `iCloud`内にある`Scriptable`のスクリプトが格納されているディレクトリへのシンボリックリンク
   2. 各種設定ファイル: `.eslintrc`, `.editorconfig`, `.prettierrc`など。`Scriptable`のスクリプトをMacで編集する時と同じ設定で使いたい場合に、必要なファイルをシンボリックリンクで共有
3. 必要なパッケージをインストールする
4. パッケージとスクリプトをつなぐためのモジュールを作成する。`src/some-module.js`を作成
5. `some-module.js`内でインストールしたパッケージを`import`する
6. `import`したものを`module.exports`を使って`export`する
7. バンドルと配置を実施する。コマンドパレットを開き、「タスクの実行」から「このファイルをバンドルしdistに配置する」を選ぶ
8. `dist`内にバンドル後のファイルが配置されたことを確認する
9. `Scriptable`スクリプトを作成する
10. そのスクリプトでバンドル後のファイルをインポートする `importModule('someModule.js')`
11. パッケージの機能を使ったスクリプトを実行する（`iPhone`または`iPad`で）
12. Enjoy!

## 注意点

### 利用できるパッケージの条件

1. ピュアJS。ネイティブコードを利用したパッケージなどは利用できません
2. `Scriptable`にないnodeコアモジュールを使用していない。→モックでカバーすればビルド可能
   1. `fs`, `path`, `util`について、モックでカバーしている
   2. `require.main`定数について、モックでカバーしている

## モジュール例

### `papaparse`

CSVパースライブラリ`papaparse`を`require`し`export`するだけのモジュール。

### `discord-rest`

`discordjs`の一部（REST呼び出し）を利用するためのモジュール。`Routes`（`discord-api-types/v10`）でエンドポイントURLを作成し、`REST4Scriptable`でリクエストを発行する。`@discordjs/rest`を

### `scriptable-ix`

デバッグ出力用モジュール。

* `node-icecream`を使おうとしたが、`Scriptable`では利用不可であったため、代用品を作った。
* `util`モジュールを使っているが、モックで一部実装。
* `node-icecream`利用不可の理由：`Scriptable`がstrictモードで動作することと、スタックトレースが取得不可のため
