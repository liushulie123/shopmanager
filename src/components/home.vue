<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <a href="#" @click.prevent="handleLoginout()" class="loginout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 导航 -->
        <!-- router :开启路由模式,点击对应的导航,当前的path就是激活导航的index值 -->
        <el-menu default-active="1" :router="true" :unique-opened="true">
          <!-- 用户管理 -->
          <el-submenu :index="item1.order+''" v-for="(item1) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item2.path+''" v-for="(item2) in item1.children" :key="item2.id">
                <i class="el-icon-service"></i>{{ item2.authName }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- 提供容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  // 如果用户没有登陆,/标识匹配到时,不能进入home.vue->显示login.vue
  // if(有没有正确的token){渲染home.vue}
  // if(没有token){改login,显示login.vue}
  // 代码位置,在渲染home.vue之前  当home.vue组件渲染完毕时->mounted()
  // beforeMount(){}
  beforeMount () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  created () {
    this.getMenus()
  },
  methods: {
    async getMenus () {
      const res = await this.$http.get(`menus`)
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.menus = data
      }
    },
    // 退出
    handleLoginout () {
      // 1.清除token
      localStorage.clear()
      // 2.跳转到Login
      this.$router.push({
        name: 'login'

      })
      // 提示
      this.$message.warning('退出成功')
    }
  }
}
</script>

<style>
.container {
  height: 100%;
  background: #b3c0d1;
}
.aside {
  background: #fff;
}
.main {
  background: gray;
}
.middle {
  text-align: center;
  line-height: 60px;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>
