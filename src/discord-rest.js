/**
 * Discord REST API wrapper for Scriptable
 * @module discord-rest
 */
const { Routes } = require("discord-api-types/v10")
const util = require("util")
const Logging = importModule("libLogging")
const logging = Logging.getInstance("HH:mm:ss.SSS")

class REST4Scriptable {
  /**
   * REST4Scriptable class for interacting with the Discord REST API.
   * @class REST4Scriptable
   * @param {Object} [options] - Configuration options for the REST4Scriptable instance.
   * @param {number} [options.version] - Discord API version.
   */
  constructor(options = {}) {
    this.version = options.version
    this.token = null
  }

  setToken(token) {
    /**
     * Sets the token for the REST API.
     * @param {string} token - Discord Bot token.
     * @returns {this} - The instance of the REST4Scriptable class.
     */
    this.token = token
    return this
  }

  async request(method, route, options = {}) {
    /**
     * Sends a request to the Discord API.
     * @param {string} method - HTTP method (GET, POST, etc.).
     * @param {string} route - Discord API route created with Routes method.
     * @param {Object} options - Additional request options.
     * @param {Object} [options.headers] - Additional headers to include in the request.
     * @param {Object} [options.body] - The body of the request.
     * @returns {Promise<*>} - The response from the API.
     */
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
    let res, json
    // logging.log(`🛜 request(${method}, ${route}, ${JSON.stringify(options)})`)
    // * リクエスト実行
    res = await req.loadString() // NOTE make Request
    // logging.log(`🛜 req.response: ${util.inspect(req.response)}`)
    // logging.log(
    //   `🛜 req.loadString(): ${res.length > 100 ? res.substring(0, 100) + "..." : res}`,
    // )
    // * レスポンスを検査する
    const status = req.response.statusCode
    if (200 <= status && status < 300) {
      // 正常系の場合はJSONをオブジェクトに変換して返す
      try {
        json = res.trim() ? JSON.parse(res) : null
      } catch (e) {
        // JSON変換に失敗した場合はnullを返す
        if (e.name == "SyntaxError") {
          json = null
        } else {
          throw e
        }
      }
      // logging.log(`🛜 json: ${util.inspect(json)}`)
      return json
    } else {
      throw new Error(`Request failed with status code ${status}`)
    }
    async function delay(ms) {
      return new Promise((resolve) => {
        Timer.schedule(ms, false, resolve) // Timer.scheduleでms後にresolve
      })
    }
  }

  async get(route, options) {
    /**
     * Sends a GET request to the Discord API.
     * @param {string} route - Discord API route created with Routes method.
     * @param {Object} options - Additional request options.
     * @param {Object} [options.headers] - Additional headers to include in the request.
     * @returns {Promise<*>} - The response from the API.
     */
    return await this.request("GET", route, options)
  }

  async delete(route, options) {
    /**
     * Sends a DELETE request to the specified route with the given options.
     * @param {string} route - The API endpoint to send the DELETE request to.
     * @param {Object} [options] - Optional settings for the request.
     * @returns {Promise<*>} - The response from the API.
     */
    return await this.request("DELETE", route, options)
  }

  async post(route, options) {
    /**
     * Sends a POST request to the Discord API.
     * @param {string} route - Discord API route created with Routes method.
     * @param {Object} options - Additional request options.
     * @param {Object} [options.headers] - Additional headers to include in the request.
     * @param {Object} [options.body] - The body of the request.
     * @returns {Promise<*>} - The response from the API.
     */
    return await this.request("POST", route, options)
  }

  async put(route, options) {
    /**
     * Sends a PUT request to the Discord API.
     * @param {string} route - Discord API route created with Routes method.
     * @param {Object} options - Additional request options.
     * @param {Object} [options.headers] - Additional headers to include in the request.
     * @param {Object} [options.body] - The body of the request.
     * @returns {Promise<*>} - The response from the API.
     */
    return await this.request("PUT", route, options)
  }

  async patch(route, options) {
    /**
     * Sends a PATCH request to the Discord API.
     * @param {string} route - Discord API route created with Routes method.
     * @param {Object} options - Additional request options.
     * @param {Object} [options.headers] - Additional headers to include in the request.
     * @param {Object} [options.body] - The body of the request.
     * @returns {Promise<*>} - The response from the API.
     */
    return await this.request("PATCH", route, options)
  }
}

globalThis.module.exports = { REST4Scriptable, Routes }
