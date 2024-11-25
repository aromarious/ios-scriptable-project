const esbuild = require("esbuild")
const path = require("path")
const fs = require("fs")

const args = process.argv.slice(2)
const entryPoint = args[0] || "src/module2bundle.js"
const entryPointDir = path.dirname(path.resolve(entryPoint))
const outfile = entryPoint
  .replace(/\bsrc\b/, "dist")
  .replace(/2bundle/, "")
  .replace(/ToBundle/, "")

// プラグイン
const mockNodeModulesPlugin = {
  name: "mock-node-modules",
  setup(build) {
    const mocks = {
      path: "./mock-path.js",
      "node:path": "./mock-path.js",
      fs: "./mock-fs.js",
      "node:fs": "./mock-fs.js",
      util: "./mock-util.js",
      "node:util": "./mock-util.js",
    }

    for (const [moduleName, mockPath] of Object.entries(mocks)) {
      build.onResolve({ filter: new RegExp(`^${moduleName}$`) }, (args) => {
        console.log(`Resolved ${moduleName} to ${mockPath}`)
        return { path: path.resolve(__dirname, mockPath) }
      })
    }
  },
}

const replaceRequireMainPlugin = {
  name: "replace-require-main",
  setup(build) {
    const mockConstantFilename = "mock-require-main.js" // * replace用js
    const requireMainRegexp = /require\s*(\/\*.*?\*\/)?\.\s*main/g
    build.onLoad({ filter: /.*\.js$/ }, async (args) => {
      const contents = await fs.promises.readFile(args.path, "utf8")

      const matchCount = (contents.match(requireMainRegexp) || []).length
      if (matchCount > 0) {
        const mockPath = path.join(entryPointDir, mockConstantFilename)
        console.log(
          `Found ${matchCount} occurrences in ${args.path}. Replacing require.main with require("${mockPath}").main`,
        )

        // すべての require.main を require("mock-constant.js").main に置き換える
        const replacedContents = contents.replace(
          requireMainRegexp,
          `require("${mockPath}").main`,
        )

        return { contents: replacedContents, loader: "js" }
      }

      return { contents, loader: "js" }
    })
  },
}

// プラグイン: バンドル後にメッセージを出力する
const buildNotifierPlugin = {
  name: "build-notifier",
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length === 0) {
        console.log(`✅ Build succeeded! Output: ${outfile}`)
      } else {
        console.error("❌ Build failed:", result.errors)
      }
    })
  },
}

// タイムスタンプを比較してバンドルするかどうかを決定する関数
async function shouldBundle(srcFile, distFile) {
  try {
    const srcStat = await fs.promises.stat(srcFile)
    const distStat = await fs.promises.stat(distFile)
    return srcStat.mtime > distStat.mtime
  } catch (err) {
    // distFileが存在しない場合はバンドルする
    if (err.code === "ENOENT") {
      return true
    }
    throw err
  }
}

// ビルドプロセスを実行する関数
async function build() {
  const shouldBundleResult = await shouldBundle(entryPoint, outfile)
  if (!shouldBundleResult) {
    console.log(`✔️ No changes detected. Skipping build for ${entryPoint}`)
    return
  }

  // esbuild ビルド
  esbuild
    .build({
      entryPoints: [entryPoint],
      bundle: true,
      outfile: outfile,
      platform: "browser", // Scriptable 用にブラウザモード
      plugins: [
        replaceRequireMainPlugin,
        mockNodeModulesPlugin,
        buildNotifierPlugin,
      ], // プラグイン適用
    })
    .catch(() => process.exit(1))
}

build()