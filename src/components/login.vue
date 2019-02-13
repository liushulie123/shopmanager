<template>
    <div class="login-wrap">
        <el-form :label-position="top" label-width="80px" :model="formdata">
            <el-form-item label="用户名">
                <el-input v-model="formdata.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formdata.password"></el-input>
            </el-form-item>
              <el-button class="login-btn" type="primary">登陆</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formdata:{
                username:'',
                password:''
            }
        }
    },
}
</script>

<style>
</style>
