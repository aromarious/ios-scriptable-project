// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: code;
// importModule('libUtil').bundleTool()
// return

/*
======== commandline ========
(cd adev/Scriptable; ./bundleIt.sh -e ./MarkdownToHTMLToBundle.js -m)
======== importCall ========
var m2h = importModule('libMarkdownToHTML');
*/

// import MarkdownIt from "markdown-it";
const MarkdownIt = require("markdown-it");
var Logging, l;

function getHtmlFromMarkdown(
  markdown,
  fullHtml = false
) {
  const md = new MarkdownIt();
  const htmlContent = md.render(markdown);
  let html;
  if (fullHtml) {
    html = getFullHtml(html);
  } else {
    html = htmlContent;
  }
  return html;
}

function getFullHtml(...htmls) {
  const htmlContent = htmls.join("\n");
  // ゴシック体を指定するためのCSSを追加
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 20px;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>
`;
}
const exports = {
  getHtmlFromMarkdown,
  getFullHtml,
};
globalThis.module.exports = (() => {
  Logging = importModule("libLogging")
  l = Logging.getInstance()
  return exports
})()
