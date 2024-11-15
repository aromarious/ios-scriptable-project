# ios-scriptable-project

このプロジェクトはiOSアプリ「Scriptable」のスクリプトを管理するためのプロジェクトです。

## 概要

[`Scriptable`](https://scriptable.app/)はiOS/iPadOS内でJavaScriptを実行することができるアプリです。
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
   2. 各種設定ファイルなど: `Scriptable`のスクリプトをMacで編集する時と同じ設定で使いたい場合など、必要なファイルをシンボリックリンクで共有
3. 必要なパッケージをインストールする
4. パッケージとスクリプトをつなぐためのモジュールを作成する。`src/someModule.js`を作成
5. `someModule.js`内でインストールしたパッケージを`import`する
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
2. `Scriptable`にない基本モジュール（`fs`など）を使用していない
