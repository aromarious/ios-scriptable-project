const { Routes } = require("discord-api-types/v10")

var REST4Scriptable = class _REST4Scriptable {
  constructor(options = {}) {
    this.version = options.version
    this.token = null
  }

  setToken(token) {
    this.token = token
    return this
  }

  async request(method, route, options = {}) {
    const url = `https://discord.com/api/v${this.version}${route}`
    const req = new Request(url)
    req.method = method
    req.headers = {
      Authorization: `Bot ${this.token}`,
      "Content-Type": "application/json",
      ...options.headers,
    }
    if (options.body) {
      req.body = JSON.stringify(options.body)
    }
    let res
    try {
      res = await req.loadJSON()
    } catch (error) {
      return null
    }
    return res
  }

  get(route, options) {
    return this.request("GET", route, options)
  }

  delete(route, options) {
    return this.request("DELETE", route, options)
  }

  post(route, options) {
    return this.request("POST", route, options)
  }

  put(route, options) {
    return this.request("PUT", route, options)
  }

  patch(route, options) {
    return this.request("PATCH", route, options)
  }
}

module.exports = { REST4Scriptable, Routes }
