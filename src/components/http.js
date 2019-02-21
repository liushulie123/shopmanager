// 让axios变成Vue插件
// 结果 在main.js 可以Vue.use(axios)
// 把axios相关代码封装成Vue的插件
import axios from 'axios'
import {
  Message
} from 'element-ui'

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

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log("res拦截器被触发----")
    console.log(response)
    const {
      meta: {
        status,
        msg
      }
    } = response.data
    if (status !== 200 && status !== 201) {
      Message.warning(msg)
    }
    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  })

  // 设置头部
  Vue.prototype.$http = axios
}
export default HttpServer
