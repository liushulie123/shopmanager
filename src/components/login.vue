<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handlelogin()" class="login-btn" type="primary">登陆</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    async handlelogin() {
      // 目前代码：异步的结果res 在一个函数里面获取的
      // 目的：res的获取是同步
      const res = await this.$http.post(`login`, this.formdata)
      const { data: { data, meta: { msg, status } } } = res
      if (status === 200) {
        // 提示：token这个值目前不需要关心。 将来要用。把token永久存储
        // session/cookie/localStorage(Html5新特性)
        // key名:要存储的数据
        localStorage.setItem("token", data.token)
        this.$router.push({
          name: "home"
        });
      } else {
        this.$message.error(msg)
      }
    }
  }
}
/*
this.$http
        .post(`login`, this.formdata)
        .then(res => {
          // 前提：api-server启动node app.js
        //   console.log(res)
          const {
            data: {
              data,
              meta: {msg, status}
            }} = res
          if(status === 200) {
            name:"home"
          } else {
            this.$message.error(msg)
          }
        })
*/
</script>
<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #fff;
  width: 400px;
  border-radius: 5px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
