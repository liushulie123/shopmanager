// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import App from './App'
import router from './router'
import CusBread from './components/cusBread.vue'
import moment from 'moment'
import HttpServer from './components/http'

Vue.use(HttpServer)

// ElementUI 其实Vue插件,和VueRouter 用法一样 Vue.use（名）
// Vue 插件的使用
Vue.use(ElementUI)

Vue.config.productionTip = false

// 全局过滤器 - 处理日期
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局自定义组件
Vue.component(CusBread.name, CusBread)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
