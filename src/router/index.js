import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
// webpack项目模板
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        }]
    },
    {
      // 当表示是login时 -> 让下面的配置生效
      // 在配置生效前,处理路由标识看看是不是login
      path: '/login',
      name: 'login',
      component: Login
    }]
})
// 路由导航守卫(保安)
// 在路由配置生效前,代码自动来到下面位置
// to 要去的路由配置对象
// form 当前的路由配置对象
router.beforeEach((to, form, next) => {
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登陆')
      router.push({name: 'login'})
      return
    }
    next()
  }
  // 如果要去的是登陆 -> 继续登陆
  // 如果要去的不是登陆 ->
  // if token 渲染 home
  // if token ->渲染login
  // next 让路由配置继续生效
  // next()
})
export default router