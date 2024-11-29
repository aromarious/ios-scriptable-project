# ios-scriptable-project

iOSアプリ「Scriptable」のスクリプトを管理するためのプロジェクト

* プロジェクト直下にはバンドルの仕組み
* [`scripts`](scripts)ディレクトリには普段使っているスクリプト。説明は[`README`](src/README.md)

を置いた。以下、バンドルの仕組みを説明する。（TODO:図解が必要） <!-- TODO プロジェクト構造の図解 -->

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
4. `src`にて、パッケージとスクリプトをつなぐためのモジュールを作成する。`src/some-module.js`を作成
5. `src/some-module.js`内で、さっきインストールした外部パッケージを`import`する
6. `import`したものを`module.exports`を使って`export`する
7. バンドルと配置を実施する。コマンドパレットを開き、「タスクの実行」から「このファイルをバンドルしdistに配置する」を選ぶ。`npm build`で`src/*.js`を全てビルドしてもよい。
8. `dist`内にバンドル後のファイル`dist/some.bundle.js`が配置されたことを確認する
9. `Scriptable`スクリプトを作成する
10. そのスクリプトでバンドル後のファイルをインポートする `importModule('some.bundle.js')`
11. パッケージの機能を使ったスクリプトを実行する（`iPhone`または`iPad`で）
12. Enjoy!

## 注意点

### 利用できるパッケージの条件

1. ピュアJS。ネイティブコードを利用したパッケージなどは利用できない
2. `Scriptable`にないnodeコアモジュールを使用していないこと。ただし、モックでカバーすればビルド可能
   1. `fs`, `path`, `util`について、モックでカバーしている
   2. `require.main`定数について、モックでカバーしている
適切なポリフィルがあればそれを持ってくればよいが、`Scriptable`で動くという条件を満たさないことがほとんど。完璧なポリフィルを探す旅に出ると永遠に帰ってこられない。だからといって、あちこちで気軽に利用されているコアモジュールにぶつかるたびに諦めるのも悔しい。実際の動作として必要のあるところだけ実装して、他はインタフェースだけ用意するモンキーパッチでしのいでいく方針でやっている。

## モジュール例

[`src/`](src/)にいくつかスクリプトが置いてある。これらは外部パッケージを利用可能にするモジュールで、バンドルすれば`Scriptable`から利用できる。バンドル前のスクリプる（バンドルすると`.bundle`つきのファイルができる）。いくつか説明する。

### [`papaparse`](src/papaparse.js)

CSVパースライブラリ`papaparse`を`require`し`export`するだけのモジュール。ピュアJSで書かれており、単純に`require`して`export`するだけのモジュールを書いてバンドルすれば`Scriptable`で利用できる。

### [`discord-rest`](src/discord-rest.js)

`discordjs`の一部（REST呼び出し）を利用するためのモジュール。

* `Routes`: エンドポイント作成のためのAPI。`discord-api-types/v10`をインポートして利用
* `REST4Scriptable`: `Discord REST`リクエストを発行するAPI。本来なら`@discordjs/rest`を使うところだが、`fetch`を利用しているために利用できない。`Scriptable`用にサブセットを実装した

## VS Code で `Scriptable` のコードを取り扱う際のTIPS

### インポートしたモジュールのコード補完を利用したい
スクリプト側（`importModule()`を呼び出すスクリプト）のコメントに `@type` を書く。

```JavaScript
/**
* @type {import("discord-rest").REST4Scriptable}
* @type {import('discord-api-types/v10').Routes}
*/
```

モジュール側にJSDocを書いておくとコード補完に反映される。
外部パッケージを利用している場合はそちらの`@types`を参照するとよい。

## 選択的公開の仕組み

ディレクトリに`.public`というファイル(YAML形式)がある場合、そこで指定されたディレクトリから指定ファイルをコピーしてきてステージする。というコマンドを用意した。コミット前に実行するようになっている。

`scripts`ディレクトリの`.public`ファイルはこうなっている:

```yaml
- original: ../dist
  files:
    - README.md
    - lg.js
    - template4script.js
    - scriptable-ix.js
```

`original`: 公開したいファイルの入っているディレクトリを指定。当該`.public`のあるディレクトリからの相対パスか、`~`で始まるパス、または絶対パスで指定する。`../dist` には実際のスクリプトが入っているが、すべて公開するわけにはいかない。ここで指定したスクリプトだけを公開する。

`files`: 公開したいファイルのリスト。`original`からの相対パスで指定する。
