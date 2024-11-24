// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: feather-alt;
/*
## 使い方
1. 関数を定義する
2. commands配列に追加する
3. commands配列に定義された関数は
  - Scriptableアクションで呼び出せて、戻り値がアクションの出力になる
  - このスクリプトをimportした時にexportされる
4. Scriptable内でテスト実行したい場合はparamsToRunInAppに次を追加しておく
  - ボタンラベル
  - パラメータを指定するオブジェクト、commandプロパティは必須（commands配列に登録した関数の名前）

## アプリ内実行での利用
1. 実行するとparamsToRunInAppに登録しておいた選択肢が表示される
2. 選択するとその関数が実行される
3. 実行結果がQuickLookで表示される

## ショートカットからの利用
1. ショートカット内に辞書アクションを作成
2. そこにcommand プロパティ及び必要な引数のプロパティを設ける
3. Scriptableアクションを作成、Parameterに辞書を設定

## モジュールとして利用する場合
1. 📌【重要】スクリプト末尾の `await main()` をコメントアウトする
2. このファイルが`module.js`なら、インポートする側のスクリプトで `importModule("module")` と書いてインポート
  1. commandsに登録したものが1つならそれが直接exportされる
    - const module = importModule("module")
  2. 2つ以上ならオブジェクトとしてexportされる
    - const { command1, command2 } = importModule("module")
 */
const systemName = Script.name()
const lg = importModule("lg")()
const ix = importModule("scriptable-ix")({ outputFunction: lg })

//#region コマンドの定義と登録
const commands = []
const paramsToRunInApp = []

//#region 例 returnInput 引数をそのまま返す
function returnInput(params) {
  return params
}
commands.push(returnInput)
paramsToRunInApp.push({
  label: "returnInput",
  params: {
    command: "returnInput",
  },
})
//#endregion returnInput 引数をそのまま返す

//#endregion コマンドの定義と登録

//#region ショートカットからの実行とアプリ内実行を支援する関数群
function createDialog(paramsList) {
  const labelList = paramsList.map((ps) => ps.label)
  const alert = new Alert()
  alert.title = "Select an item to execute"
  labelList.forEach((o) => {
    alert.addAction(o)
  })
  alert.addCancelAction("Cancel")
  return alert
}

async function completeScript(result) {
  if (config.runsWithSiri) {
    Script.setShortcutOutput(result)
    Script.complete()
    ix("* Script.complete()")
  } else if (config.runsInApp && result != null) {
    if (typeof result === "function") {
      result = result.toString()
    }
    console.log(result)
    await QuickLook.present(result, false)
  }
  return
}

async function main() {
  ix(`🚩${Script.name()} started`)
  ix(`* runsWithSiri: ${config.runsWithSiri}`)
  const commandNames = Object.keys(commands)
  let params = {}
  if (config.runsInApp) {
    const dialog = createDialog(paramsToRunInApp)
    const index = await dialog.present()
    params =
      0 <= index && index < paramsToRunInApp.length
        ? paramsToRunInApp[index].params
        : {}
  } else if (config.runsWithSiri) {
    params = args.shortcutParameter
  }
  ix("params: ", params)
  let result
  if (Object.keys(params).length > 0) {
    const func = commands.find((c) => c.name === params.command)
    result = await func(params)
  } else {
    result = null
  }

  ix("result: ", result)
  ix(`🚩${Script.name()} finished`)
  await completeScript(result)
  return result
}
//#endregion

if (config.runsInApp || config.runsWithSiri) {
  //#region モジュールとして使うときはawaitを含む行をコメントアウトする
  await main()
  //#endregion モジュールとして使うときはawaitを含む行をコメントアウトする
}

const exports =
  commands.length > 1
    ? Object.fromEntries(commands.map((c) => [c.name, c]))
    : commands[0]
module.exports = exports
