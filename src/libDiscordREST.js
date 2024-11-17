const { Routes } = require("discord-api-types/v10")

var MiniREST = class _MiniREST {
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
      'Content-Type': 'application/json',
      ...options.headers
    }
    if (options.body) {
      req.body = JSON.stringify(options.body)
    }
    const res = await req.loadJSON()
    if (res.error) {
      throw new Error(res.error)
    }
    return res
  }

  get(route, options) {
    return this.request('GET', route, options)
  }

  delete(route, options) {
    return this.request('DELETE', route, options)
  }

  post(route, options) {
    return this.request('POST', route, options)
  }

  put(route, options) {
    return this.request('PUT', route, options)
  }

  patch(route, options) {
    return this.request('PATCH', route, options)
  }
}

module.exports = { MiniREST, Routes }
