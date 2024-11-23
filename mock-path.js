/**
 * Mock path module for Scriptable
 */
const path = {
  join: (...args) => args.join("/"),
  basename: (path) => path.split("/").pop(),
  dirname: (path) => path.split("/").slice(0, -1).join("/"),
  extname: (path) => {
    const match = path.match(/\.[^/.]+$/)
    return match ? match[0] : ""
  },
}
module.exports = path
