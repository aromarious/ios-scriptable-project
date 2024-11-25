# ios-scriptable-project/scripts

iOSアプリ「`Scriptable`」用のスクリプト群

## [`scriptable-ix`](scriptable-ix2bundle.js)

デバッグ出力用モジュール。`util`の`inspect`を使って内容を見ることができる。

### 経緯

* `node-icecream`を使おうとしたが、`Scriptable`では利用不可であったため、代用品を作った。
* `node-icecream`の出力を一部取り入れ、Nodeコアモジュールの`util.inspect`を使っている。とはいえ、コアモジュールを直接使うことはできないため、`node-inspect-extracted`パッケージを利用した部分実装済モックを作成し対応。
* `node-icecream`利用不可の理由：`Scriptable`ではスクリプトがstrictモードで動作することと、スタックトレースが取得不可であるため

### 使い方

```JavaScript
const ix = importModule('scriptable-ix')()
ix("Hello World!")
```

コンソールに次のように出力される。

```text
🔍 'Hello, world!' [at <anonymous>]
```

関数取得時にプレフィクスと出力関数のカスタマイズが可能。引数とデフォルト値は次のとおり:

```Javascript
  prefix = () => { return return "\u{1F50D} "} // 🔍
  outputFunction = console.log
```

プレフィクスは文字列でもよいし、関数を渡してもよい。出力関数は関数を渡す。

## [`lg`](lg.js)

ログをコンソールとファイルに出力するためのモジュール。

ショートカットから利用する場合コンソールがなく、`console.log`でのデバッグ出力を見ることができない。また、Macでの開発においてもコンソール出力にアクセスするにはスクリプトエディタを開かねばならない。いずれの場合にも、このモジュールを使えばデバッグ出力がファイルで確認できる。

### 使い方

```JavaScript
const lg = importModule('lg')()
lg('Hello World!')
```

ファイルは`Scriptable`のスクリプトフォルダの直下の`logs`フォルダ内に作成される。
実行したスクリプト名と、スクリプトの起動時刻がファイル名になる。ログの各行の冒頭にはタイムスタンプ。

コンソール出力:

```text
10:48:32.134 Hello world!
```

ファイル出力:

```text
ファイル名: logs/Untitled Script-20241125-104832.txt
10:48:32.134 Hello world!
```

関数取得時にファイル名やタイムスタンプのカスタマイズが可能。引数とデフォルト値は次のとおり:

```JavaScript
  systemName = Script.name()
  fileNameTimeFormat = "yyyyMMdd-HHmmss"
  fileNameTemplate = "`${systemName}-${_df.string(date)}.txt`"
  logTimeFormat = "HH:mm:ss.SSS"
```

例:

```JavaScript
const lg = importModule('lg')({ logTimeFormat: 'HH:mm:ss' })
lg('Hello World!')
```

コンソール出力:

```text
10:48:32 Hello world!
```

ファイル出力:

```text
ファイル名: logs/Untitled Script-20241125-104832.txt
10:48:32 Hello world!
```

## [`lg`](lg.js)と[`ix`](ix.js)をあわせて使う

`ix`は関数取得時に出力関数を設定できる。`lg`を渡してやればファイルに出力できる。

```JavaScript
const lg = importModule('lg')()
const ix = importModule("scriptable-ix")({
  prefix: "🐥 ",
  outputFunction: lg,
})
```

コンソール出力:

```text
10:48:32.134 🐥 'Hello, world!' [at <anonymous>]
```

ファイル出力

```text
ファイル名: logs/Untitled Script-20241125-104832.txt
10:48:32.134 🐥 'Hello, world!' [at <anonymous>]
```

## [`template4script`](template4scipt.js)

`Scriptable`はショートカットから利用する人も多いだろう。
ショートカット用のスクリプトを開発しやすいような枠組みを用意した。

### iPhoneでの開発時

最終的にショートカットから利用するとはいえ、コードを書くときには`Scriptable`アプリ内で書く。ショートカットで呼び出す予定の関数を、アプリ内でも共通で呼び出し、動作確認しながら書けるようにした。

### Macでの開発時

* MacのVS Codeでスクリプトを書きながら
* iPhoneで実行して動作確認

という開発スタイルの場合もあるだろう。

Macでスクリプトを変更しても、iPhoneの`Scriptable`でスクリプトエディタを開いたままだと変更が反映されない。いったん閉じてスクリプト一覧画面に戻ったあと再度開く必要があり、手間がバカにならない。

一案として、一覧画面での直接実行を可能にするテンプレートを作成した。このテンプレートを使ったスクリプトなら、一覧画面から実行したときに、実行結果がクイックルックで、デバッグログがログファイルで確認できる。

### 使い方

1. 関数を定義する
2. `commands`配列に追加する
3. `commands`配列に定義された関数は

* Scriptableアクションで呼び出せて、戻り値がアクションの出力になる
* このスクリプトをimportした時にexportされる

4. `Scriptable`内でテスト実行したい場合は`paramsToRunInApp`にこれらを追加しておく

* ボタンラベル
* パラメータを指定するオブジェクト、commandプロパティは必須（`commands`配列に登録した関数の名前）

```javascript
// 関数定義
function returnInput(params) {
  return params
}
// commands配列に追加
commands.push(returnInput)
// テスト実行用パラメータ追加
paramsToRunInApp.push({
  label: "returnInput",
  params: {
    command: "returnInput",
  },
})
```

### アプリ内実行での利用

1. 実行すると`paramsToRunInApp`に登録しておいた選択肢が表示される（選択肢が複数の場合。1つしかなければ自動的に実行される）
2. 選択するとその関数が実行される
3. 実行結果がQuickLookで表示される

### ショートカットからの利用

1. ショートカット内に辞書アクションを作成
2. そこに`command`プロパティと、必要な引数のプロパティを設ける
3. `Scriptable`アクションを作成、`Parameter`に辞書を設定

### モジュールとして利用する場合

1. 📌【重要】スクリプト末尾の `await main()` をコメントアウトする
2. このファイルが`module.js`なら、インポートする側のスクリプトで `importModule("module")` と書いてインポート
1. commandsに登録したものが1つならそれを直接exportする

```JavaScript
const module = importModule("module")
```

4. 複数ならオブジェクトとしてexportされる

```JavaScript
const { command1, command2 } = importModule("module")
```
