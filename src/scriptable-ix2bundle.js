const util = require("util")

function getDefaultPrefix() {
  return "\u{1F50D} " // 🔍
}
function callOrReturn(thing) {
  if (thing instanceof Function) {
    return thing()
  }
  return thing
}
function ixWrapper({
  prefix = getDefaultPrefix,
  outputFunction = console.log,
} = {}) {
  return function ix(...args) {
    let callerFunctionName = new Error().stack.split("\n")[1].replace(/@$/, "")
    callerFunctionName = callerFunctionName || "anonymous"
    const output =
      args.length > 0
        ? ixWithArguments(callerFunctionName, args)
        : ixWithoutArguments(callerFunctionName)
    outputFunction(`${callOrReturn(prefix)}${output}`)
    if (args.length === 1) {
      return args[0]
    }
    if (args.length > 1) {
      return args
    }
    return void 0
  }
}
function ixWithArguments(functionName, args) {
  const outputArr = args.map((arg, i) => {
    const result = util.inspect(arg, { depth: null })
    return `${result}`
  })
  return (
    outputArr.join(", ") +
    // (args.length > 1 ? "\n" : "") +
    ` [at ${functionName}]`
  )
}
function ixWithoutArguments(functionName) {
  return `[at ${functionName}]`
}

globalThis.module.exports = ixWrapper
