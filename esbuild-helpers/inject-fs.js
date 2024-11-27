/**
 * Mock fs module for Scriptable
 */
const fm = FileManager.iCloud().isAvailable()
  ? FileManager.iCloud()
  : FileManager.local()

const fs = {
  readFileSync: (path) => {
    const content = fm.readString(path)
    return content
  },
  writeFileSync: (path, data) => {
    fm.writeString(path, data)
  },
}

module.exports = fs
