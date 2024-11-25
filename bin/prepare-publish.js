const fs = require("fs")
const path = require("path")
const os = require("os")
const yaml = require("js-yaml")
const { execSync } = require("child_process")
const ic = require("node-icecream")()
const icf = require("node-icecream")({ prefix: "🚩 " })

// プロジェクトルートを取得
const PROJECT_ROOT = execSync("git rev-parse --show-toplevel").toString().trim()
// ステージ済みファイル一覧を取得
// prettier-ignore
const filesAlreadyStaged = execSync(`git diff --name-only --cached`).toString().trim().split("\n")

// `.public` ファイルを探す
function findPublicFiles(dir) {
  const results = []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  files.forEach((file) => {
    const filePath = path.join(dir, file.name)
    // `.git` ディレクトリを除外
    if (file.isDirectory() && file.name === ".git") {
      return // スキップ
    }
    // `.gitignore` をチェック
    const isIgnored = checkGitIgnore(filePath)
    if (isIgnored) {
      return // スキップ
    }
    if (file.isDirectory()) {
      results.push(...findPublicFiles(filePath)) // 再帰呼び出し
    } else if (file.name === ".public") {
      results.push(filePath)
    }
  })
  return results
}
function checkGitIgnore(filePath) {
  try {
    const result = execSync(`git check-ignore "${filePath}"`, {
      encoding: "utf-8",
    })
    return result.trim() !== "" // 無視されている場合は結果が非空
  } catch (error) {
    return false // 無視されていない場合
  }
}

// original パスを解釈する
function resolveOriginalPath(original, publicFilePath) {
  if (original.startsWith("~")) {
    return path.join(os.homedir(), original.slice(1))
  }

  if (path.isAbsolute(original)) {
    return original
  }

  if (original.startsWith("../") || original.startsWith("./")) {
    return path.resolve(path.dirname(publicFilePath), original)
  }

  return path.join(PROJECT_ROOT, original)
}

// ファイルをコピーする
function processPublicFile(publicFilePath) {
  const rawContent = fs.readFileSync(publicFilePath, "utf8")
  const config = yaml.load(rawContent)
  ic(config)

  config.forEach((entry) => {
    ic(filesAlreadyStaged)
    const originalPath = resolveOriginalPath(entry.original, publicFilePath)
    ic(entry.original, originalPath)

    entry.files.forEach((file) => {
      const src = path.join(originalPath, file)
      const dest = path.join(path.dirname(publicFilePath), file)
      const relativeDest = path.relative(PROJECT_ROOT, dest)
      const relativeSrc = path.relative(PROJECT_ROOT, src)

      if (!fs.existsSync(src)) {
        console.warn(`Warning: Source file does not exist: ${src}`)
        return
      }

      // コピー処理
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
      // console.log(`Copied: ${src} -> ${dest}`)
      icf(relativeSrc, relativeDest)
      console.log(`Copied: ${relativeSrc} -> ${relativeDest}`)
      const isAlreadyStaged = filesAlreadyStaged.includes(relativeDest)
      ic(relativeDest, isAlreadyStaged)
      if (!isAlreadyStaged) {
        // Gitステージングに追加
        icf(`git add "${relativeDest}"`)
        execSync(`git add "${relativeDest}"`)
      }
    })
  })
}

// メイン処理
function main() {
  const publicFiles = findPublicFiles(PROJECT_ROOT)
  ic(publicFiles)

  if (publicFiles.length === 0) {
    console.log("No .public files found.")
    return
  }
  publicFiles.forEach((publicFilePath) => {
    console.log(`Processing: ${publicFilePath}`)
    processPublicFile(publicFilePath)
  })
}

main()
