// 让axios变成Vue插件
// 结果 在main.js 可以Vue.use(axios)
// 把axios相关代码封装成Vue的插件
import axios from 'axios'

const HttpServer = {}
HttpServer.install = function (Vue) {
  // 插件要封装的功能
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  axios.interceptors.request.use(function (config) {
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers.common['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  // 设置头部
  Vue.prototype.$http = axios
}
export default HttpServer
