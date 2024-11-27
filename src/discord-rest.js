/**
 * Discord REST API wrapper for Scriptable
 * @module discord-rest
 */
const { Routes } = require("discord-api-types/v10")

/**
 * REST4Scriptable class for interacting with the Discord REST API.
 */
class REST4Scriptable {
  /**
   * @param {Object} options - Configuration options for the REST4Scriptable instance.
   * @param {number} options.version - Discord API version.
   */
  constructor(options = {}) {
    this.version = options.version
    this.token = null
  }

  /**
   * Sets the token for the REST API.
   * @param {string} token - Discord Bot token.
   * @returns {this} - The instance of the REST4Scriptable class.
   */
  setToken(token) {
    this.token = token
    return this
  }

  /**
   * Sends a request to the Discord REST API.
   * @param {string} method - HTTP method (GET, POST, etc.).
   * @param {string} route - Discord API route created with Routes method.
   * @param {Object} options - Additional request options.
   * @param {Object} [options.headers] - Additional headers to include in the request.
   * @param {Object} [options.body] - The body of the request.
   * @returns {Promise<*>} - The response from the API.
   */
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
    async function delay(ms) {
      return new Promise((resolve) => {
        Timer.schedule(ms, false, resolve) // Timer.scheduleでms後にresolve
      })
    }
    await new Promise((resolve) => {
      Timer.schedule(5000, false, resolve)
    })
    return res
  }

  /**
   * Sends a GET request to the Discord API.
   * @param {string} route - Discord API route created with Routes method.
   * @param {Object} options - Additional request options.
   * @param {Object} [options.headers] - Additional headers to include in the request.
   * @returns {Promise<*>} - The response from the API.
   */
  async get(route, options) {
    return await this.request("GET", route, options)
  }

  /**
   * Sends a DELETE request to the specified route with the given options.
   * @param {string} route - The API endpoint to send the DELETE request to.
   * @param {Object} [options] - Optional settings for the request.
   * @returns {Promise<*>} - The response from the API.
   */
  async delete(route, options) {
    return await this.request("DELETE", route, options)
  }

  /**
   * Sends a POST request to the Discord API.
   * @param {string} route - Discord API route created with Routes method.
   * @param {Object} options - Additional request options.
   * @param {Object} [options.headers] - Additional headers to include in the request.
   * @param {Object} [options.body] - The body of the request.
   * @returns {Promise<*>} - The response from the API.
   */
  async post(route, options) {
    return await this.request("POST", route, options)
  }

  /**
   * Sends a PUT request to the Discord API.
   * @param {string} route - Discord API route created with Routes method.
   * @param {Object} options - Additional request options.
   * @param {Object} [options.headers] - Additional headers to include in the request.
   * @param {Object} [options.body] - The body of the request.
   * @returns {Promise<*>} - The response from the API.
   */
  async put(route, options) {
    return await this.request("PUT", route, options)
  }

  /**
   * Sends a PATCH request to the Discord API.
   * @param {string} route - Discord API route created with Routes method.
   * @param {Object} options - Additional request options.
   * @param {Object} [options.headers] - Additional headers to include in the request.
   * @param {Object} [options.body] - The body of the request.
   * @returns {Promise<*>} - The response from the API.
   */
  async patch(route, options) {
    return await this.request("PATCH", route, options)
  }
}

globalThis.module.exports = { REST4Scriptable, Routes }
