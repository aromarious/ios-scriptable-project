#!/bin/bash
# このスクリプトは`src/`内のすべてのScriptableスクリプトをビルドします。
# 各スクリプトは esbuild を使用して個別に処理されます。

# srcディレクトリ内の*2bundle.jsと*ToBundle.jsファイルを対象にビルドする（esbuild）
for file in src/*2bundle.js src/*ToBundle.js; do
  if [ -f "$file" ]; then
    echo "Building $file..."
    node ./bin/build.js "$file"
  fi
done
