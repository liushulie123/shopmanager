<template>
    <el-card>
        <!-- 面包屑 -->
        <!-- 首页
             用户管理
             用户列表
         -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 搜索框 -->
        <el-row class="searchBox">
            <el-col>
                <el-input class="searchInput" placeholder="请输入内容" v-model="query">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type='green'>添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <!-- tableData是[{data:?,name:?.address:?}] 
        el-table-column 控制列
        label控制的是表头
        prop控制的是该列中每一行单元格内容

        -->
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="id" label="#" width="80">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="140">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="140">
            </el-table-column>
            <!-- 过滤器fmtdate
            1. v-binde:
            2. {{create_time|fmtdate}}
            3. 单元格内容不是prop的值,希望{{}}的结果->
                如果单元格内容不是prop的值,
            3.1需要给单元格内容的外层加temeplate
            此外,外层数据和内层数据有联系嘛?   没联系
            外层的list.对象.create_time
            3.2template有一个属性slot-scope="外层数据"
            3.3slot-scope的值自动绑定为外层数据el-table :data="list"
            3.4在template内部通过list.row 自动去除数组list中每个对象
            3.5list.ow.属性create_time
            注意: row是固定写法
             -->
            <el-table-column label="创建日期" width="200">
                <template slot-scope="scope">
                    <!-- 内层list.row  表示的是list的每个对象 -->
                    {{scope.row.create_time|fmtdate}}
                </template>
            </el-table-column>
            <el-table-column label="用户状态" width="120">
                <!-- 前提:单元格内容是一个组件,不是porp的值 -->
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button plain size="mini" type="success" icon="el-icon-check" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[1,3,5]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            // 搜索关键字
            query: '',
            // 分页->前提借口必须支持分页->通常在接口url参数中类似page的参数名
            pagenum: 1,
            pagesize: 2,
            total:-1,
            // 表格数据
            list: []
        }
    },
    created() {
        this.getTbableData()
    },
    methods: {
        //分页相关的方法
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
            this.pagenum = 1
            this.pagesize = val 
            this.getTbableData()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`)
            //根据新页码发送请求
            this.pagenum = val
            this.getTbableData()
        },
        async getTbableData() {
            // `${name}`

            // 请求头
            // {
            //     contentType:'text/html';
            //     Authorization:?
            // }
            // 设置请求头
            // 设置发送请求时的请求头->axios库->找axios中有没有可以设置headers头部的API->看axios文档
            const AUTH_TOKEN = localStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            const { data, meta: { status, msg } } = res.data
            if (status === 200) {
                this.total = data.total
                this.list = data.users
                // console.log(this.list)
            }
        }
    },
}
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
