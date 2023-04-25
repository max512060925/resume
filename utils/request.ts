import Message from './customMessage'
import QS from 'qs'

enum ErrorCode {
  '400:参数错误' = 400,
  '401:没有权限' = 401,
  '403:拒绝请求' = 403,
  '404:未找到服务器资源' = 404,
  '408:请求超时' = 408,
}

export class FetchRequest {
  source: Map<string, AbortController>
  options: { prefix?: string } & RequestInit
  constructor(config = {}) {
    this.options = config
    this.source = new Map()
  }

  async send(url, options) {
    try {
      options = { ...this.options, ...options }
      const source = new AbortController()
      this.source.set(url, source)
      if (options.prefix) {
        const prefix = options.prefix
        url = `${prefix}${url}`
      }
      if (options.params) {
        url += `?${QS.stringify(options.params)}`
      }
      const headers = options.headers || {}
      if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }
      if (headers['Content-Type'] === 'application/json' && options.body) {
        options.body = JSON.stringify(options.body)
      }
      const res: any = await $fetch(url, {
        ...options,
        headers,
        signal: source.signal,
      })
      this.source.delete(url)
      if (res instanceof ReadableStream || res instanceof Blob) {
        return res
      } else if (res?.code === 0) {
        return this.callBack(res)
      } else {
        return this.failBack(res)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return Promise.resolve(null)
      } else {
        console.log({
          type: 'error',
          msg: JSON.stringify({ http: 'recive', data: error }),
        })
        return Promise.resolve(this.failBack(error))
      }
    }
  }

  async get(api, params?) {
    return await this.send(api, { params, method: 'get', responseType: 'json' })
  }
  async getFile(api, params?) {
    return await this.send(api, {
      params,
      method: 'get',
      responseType: 'blob',
    })
  }
  async getFileByPost(api, body?) {
    return await this.send(api, {
      body,
      method: 'get',
      responseType: 'blob',
    })
  }
  async post(api, body?, options?) {
    return await this.send(api, { ...options, method: 'post', body })
  }

  async put(api, body?) {
    return await this.send(api, { method: 'put', body })
  }
  async delete(api, params?) {
    return await this.send(api, { method: 'delete', params })
  }
  callBack(res) {
    if ([0, 405].includes(res.code)) {
      return res
    } else {
      Message.error(res.message)
      return false
    }
  }
  async failBack(err) {
    if (err?.status < 500) {
      err.messages = ErrorCode[err.status] || `连接错误${err.status}`
    } else if (err.status >= 500) {
      const body = await err.body.clone().json()
      err.messages = `服务器错误${body.message}`
    }
    Message.error(err.messages)
    return null
  }
  cancelAll() {
    this.source.forEach((source, url) => {
      source.abort('请求取消！')
      this.source.delete(url)
    })
  }
  setBaseUrl(prefix) {
    this.options.prefix = prefix
  }
}
export default new FetchRequest()
