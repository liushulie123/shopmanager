<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
// 封装函数的技巧
// 1. 把重复代码当成函数体
// 2. 把变化的量当成函数形参
export default {
  name: 'cusBread',
  data () {
    return {
      // level1 :"权限管理",
      // level2 :"权限列表"
    }
  },
  // level1 和 level2 的值是来源于外部的 但是data 的数据的值来源于自己本身
  // 此时,要把数据声明写在选项props
  props: ['level1', 'level2']
}
</script>

<style>
</style>
