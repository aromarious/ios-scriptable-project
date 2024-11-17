#!/bin/bash

# 引数から入力ファイルを取得
input_file="$1"
echo "Input file: $input_file"

# 入力ファイル名を加工して出力ファイル名を作成
output_file=$(basename "$input_file" .js)
output_file="dist/${output_file/ToBundle/}.js"
echo "Output file: $output_file"

# esbuildコマンドを実行
npx esbuild "$input_file" --bundle --platform=node --tree-shaking=true --external:node:.* --format=cjs --outfile="$output_file"

echo "Bundled $input_file to $output_file"
