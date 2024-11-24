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

/**
 * returns a function that inspects the arguments using util.inspect
 * @param {Object} options
 * @param {Function} [options.prefix] - A function that returns the prefix to use in the output.
 * @param {Function} [options.outputFunction] - The function to use to output the debug information.
 * @returns {Function} - The ix function.
 * @example
 * const ix = ixWrapper()
 * ix("Hello, world!")
 * > 🔍 'Hello, world!'
 */
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
  const outputArr = args.map((arg, i) => util.inspect(arg, { depth: null }))
  return (
    outputArr.join(", ") +
    (functionName !== "" ? ` [at <${functionName}>]` : "")
  )
}
function ixWithoutArguments(functionName) {
  if (functionName === "") {
    functionName = "anonymous"
  }
  return `[at <${functionName}>]`
}

globalThis.module.exports = ixWrapper
