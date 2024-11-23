/**
 * Mock main module for Scriptable
 */
const fm = FileManager.iCloud().isAvailable()
  ? FileManager.iCloud()
  : FileManager.local()

const main = {
  // エントリスクリプトの絶対パス
  filename: `${fm.documentsDirectory()}/${Script.name()}`,

  // モックとして空の配列（子モジュール）
  children: [],

  // エントリポイントの ID（Node.js では通常 "."）
  id: ".",

  // モジュールがロード済みかどうか
  loaded: true,

  // エントリポイントに親モジュールはないため null
  parent: null,

  // 必要なら追加可能なプロパティ
  // たとえばモジュールのパス情報など
  paths: [`${fm.documentsDirectory()}/node_modules`],
}

module.exports = {
  main,
}
