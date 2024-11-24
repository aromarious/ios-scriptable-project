# ios-scriptable-project

このプロジェクトはiOSアプリ「Scriptable」のスクリプトを管理するためのプロジェクト。

## 概要

[`Scriptable`](https://scriptable.app/)はiOS/iPadOS内のJavaScript実行環境。
`Scriptable`を使っていると、`Scriptable`から`npm`パッケージを利用したいことも出てくる。
`Mac`でパッケージをバンドルしてモジュールを作れば利用できる。そのためのプロジェクト。

## 必要なもの

* `Scriptable`アプリ。無料。[`Scriptable`](https://apps.apple.com/jp/app/scriptable/id1405459188)
* `iCloud`
* `Mac`と`VSCode`

`Scriptable`アプリで実行するスクリプトは`iCloud`を通して`Mac`からも編集できる。
それを利用して、`Mac`でモジュールをバンドルする。

## 使い方

`Scriptable`のスクリプトを書いている時に、`npm`パッケージを使いたいことがある。
このプロジェクトを使って、バンドルされたモジュールを作成し、`Scriptable`から`importModule`でインポートできる。

1. このリポジトリをクローンする
2. 必要なシンボリックリンクを張る
   1. このプロジェクトにて
      1. `dist`: `Scriptable`ディレクトリ（`iCloud`内にある`Scriptable`のスクリプトが格納されているディレクトリ）へのシンボリックリンク。バンドル後に格納するため。`ln -s "~/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents" dist`
      2. 各種設定ファイル: `.eslintrc`, `.editorconfig`, `.prettierrc`など。`Scriptable`のスクリプトをMacで編集する時と同じ設定で使いたい場合に、必要なファイルをシンボリックリンクで共有。
   2. `Scriptable`ディレクトリにて
      1. `$ cd "~/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents"`
      2. `@types`: プロジェクトの`node_modules/@types`にリンクを張る
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

1. ピュアJS。ネイティブコードを利用したパッケージなどは利用できない
2. `Scriptable`にないnodeコアモジュールを使用していないこと。ただし、モックでカバーすればビルド可能
   1. `fs`, `path`, `util`について、モックでカバーしている
   2. `require.main`定数について、モックでカバーしている
適切なポリフィルがあればそれを持ってくればよいが、`Scriptable`で動くという条件を満たさないことがほとんど。完璧なポリフィルを探す旅に出ると帰ってこられない。コアモジュールはコアモジュールなだけにあちこちで気軽に利用されている。実際の動作として必要のあるところだけ実装して、他はインタフェースだけ用意してやれば用が足りるので、モンキーパッチでしのいでいく方針でやっている。

## モジュール例

[`src/`](src/)にいくつかスクリプトが置いてある。これらは外部パッケージを利用可能にするモジュールで、バンドルすれば`Scriptable`から利用できる。バンドル前のスクリプトのファイル名には`2bundle`をつけてある（バンドルすると`2bundle`なしのファイル名のものができる）。いくつか説明する。

### [`papaparse`](src/papaparse2bundle.js)

CSVパースライブラリ`papaparse`を`require`し`export`するだけのモジュール。ピュアJSで書かれており、単純に`require`して`export`するだけのモジュールを書いてバンドルすれば`Scriptable`で利用できる。

### [`discord-rest`](src/discord-rest2bundle.js)

`discordjs`の一部（REST呼び出し）を利用するためのモジュール。

* `Routes`: エンドポイント作成のためのAPI。`discord-api-types/v10`をインポートして利用
* `REST4Scriptable`: `Discord REST`リクエストを発行するAPI。本来なら`@discordjs/rest`を使うところだが、`fetch`を利用しているために利用できない。`Scriptable`用にサブセットを実装した

### [`scriptable-ix`](src/scriptable-ix2bundle.js)

デバッグ出力用モジュール。

* `node-icecream`を使おうとしたが、`Scriptable`では利用不可であったため、代用品を作った。
* `util`モジュールを使っている。外部パッケージを利用したモックで一部実装。
* `node-icecream`利用不可の理由：`Scriptable`ではスクリプトがstrictモードで動作することと、スタックトレースが取得不可であるため

## VS Code で `Scriptable` のコードを取り扱う際のTIPS

### インポートしたモジュールのコード補完を利用したい

スクリプト側で `@types` を書く。

```JavaScript
/**
* @type {import("discord-rest").REST4Scriptable}
* @type {import('discord-api-types/v10').Routes}
*/
```

モジュール側にJSDocを書いておくとコード補完に反映される。
外部パッケージを利用している場合はそちらを参照するとよい。
