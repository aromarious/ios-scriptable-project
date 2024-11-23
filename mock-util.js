/**
 * Mock util module for Scriptable
 */
const util_inspect = require("node-inspect-extracted")

const util = {
  inspect: util_inspect.inspect,
  format: util_inspect.format,
  formatWithOptions: util_inspect.formatWithOptions,
  Proxy: util_inspect.Proxy,
  stylizeWithColor: util_inspect.stylizeWithColor,
  stylizeWithHTML: util_inspect.stylizeWithHTML,
  types: {
    isString: (arg) => typeof arg === "string",
    isNumber: (arg) => typeof arg === "number",
    isObject: (arg) => arg !== null && typeof arg === "object",
    isFunction: (arg) => typeof arg === "function",
    isArray: (arg) => Array.isArray(arg),
    isBoolean: (arg) => typeof arg === "boolean",
    isUndefined: (arg) => typeof arg === "undefined",
    isNull: (arg) => arg === null,
  },
}

module.exports = util
