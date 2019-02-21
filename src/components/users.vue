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
                <el-input @clear="getAllUsers()" class="searchInput" placeholder="请输入内容" v-model="query">
                    <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button @click="showDiaAddUsers()" type='green'>添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <!-- tableData是[{data:?,name:?.address:?}]
        el-table-column 控制列
        label控制的是表头
        prop控制的是该列中每一行单元格内容

        -->
        <el-table 
        v-loading = "loading"
        :data="list" style="width: 100%">
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
                    <el-switch @change="changeState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="showDiaEditUser(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="showMsgBox(scope.row)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button @click="showDiaSetRole(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[1,3,5]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
            <el-form label-position="left" label-width="80px" :model="formdata">
                <el-form-item label="用户名">
                    <el-input v-model="formdata.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formdata.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="formdata.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="formdata.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
            <el-form label-position="left" label-width="80px" :model="formdata">
                <el-form-item label="用户名">
                    <el-input disabled v-model="formdata.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="formdata.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="formdata.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 对话框  -  角色 -->
        <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
            <el-form :model="formdata" label-positione = "left" label-width="80px">
                <el-form-item label="用户名">
                    {{currUsername}}
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="selectVal" placeholder="请选择角色名称">
                        <el-option label="请选择" :value="-1"></el-option>
                        <!-- 其余5个option是动态生成的 v-for-->
                        <el-option
                        :label = 'item.roleName'
                        :value="item.id"
                        v-for="(item) in roles" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 搜索关键字
      query: '',
      // 分页->前提借口必须支持分页->通常在接口url参数中类似page的参数名
      pagenum: 1,
      pagesize: 1,
      total: -1,
      // 表格数据
      list: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 下拉框使用的数据
      selectVal: -1,
      // 保存角色的数据
      roles: [],
      currUsername: '',
      currUserId: -1,
      loading:true
    }
  },
  created () {
    this.getTbableData()
  },
  methods: {
    // 分配角色 - 发送请求
    async setRole () {
      // 发送请求
      const res = await this.$http.put(`users/${this.currUserId}/role`, {rid: this.selectVal})
      const {meta: {msg, status}, data} = res.data
      if (status === 200) {
        this.dialogFormVisibleRole = false
        this.$message.success(msg)
      }
      // 关闭对话框
    },
    // // 分配角色 - 显示对话框
    async showDiaSetRole (user) {
      this.currUserId = user.id
      this.currUsername = user.username
      this.dialogFormVisibleRole = true
      // 获取所有角色名称(5个)
      const res = await this.$http.get(`roles`)
      const {meta: {msg, status}, data} = res.data
      if (status === 200) {
        this.roles = data
      }

      // 获取当前用户的角色id
      const res2 = await this.$http.get(`users/${user.id}`)
      // const {meta:{msg2,status2},data2} = res2.data
      // if(status === 200){
      this.selectVal = res2.data.data.rid
      // }
    },
    // 修改用户状态
    async changeState (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const { meta: { status, msg } } = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
    },
    // 编辑 - 发送请求
    async editUser () {
      const res = await this.$http.put(`users/${this.formdata.id}`, this.formdata)
      // 使用this.formdata  必须确保是有值的
      const { meta: { msg, status } } = res.data
      if (status === 200) {
        this.dialogFormVisibleEdit = false
        this.$message.success(msg)
        this.getTbableData()
      } else {
        this.$message.error(msg)
      }
    },
    // 编辑- 显示对话框
    async showDiaEditUser (user) {
      const res = await this.$http.get(`users/${user.id}`)
      // 使用this.formdata  必须确保是有值的
      this.formdata = res.data.data
      this.dialogFormVisibleEdit = true
    },
    // 删除 - 弹出确认框
    async showMsgBox (user) {
      this.$confirm('是否删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送请求
          const res = await this.$http.delete(`users/${user.id}`)
          const { meta: { msg, status } } = res.data
          if (status === 200) {
            // 提示框
            this.$message.success(msg)
            this.pagenum = 1
            this.getTbableData()
          }
        }).catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 添加用户-发送请求
    async addUser () {
      // 获取表单数据  发送请求
      const res = await this.$http.post(`users`, this.formdata)
      // 关闭对话框
      this.dialogFormVisibleAdd = false
      // 更新表格
      this.getTbableData()
    },    // 添加用户-展示对话框
    showDiaAddUsers () {
      this.formdata = {}
      this.dialogFormVisibleAdd = true
    },
    // 清空时获取所有用户
    getAllUsers () {
      this.getTbableData()
    },
    // 搜索用户
    searchUser () {
      // query数据默认''
      this.pagenum = 1
      this.getTbableData()
    },
    // 分页相关的方法
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getTbableData()
    },
    handleCurrentChange (val) {
      // 根据新页码发送请求
      this.pagenum = val
      this.getTbableData()
    },
    async getTbableData () {
      // `${name}`

      // 请求头
      // {
      //     contentType:'text/html';
      //     Authorization:?
      // }
      // 设置请求头
      // 设置发送请求时的请求头->axios库->找axios中有没有可以设置headers头部的API->看axios文档
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      const { data, meta: { status, msg } } = res.data
      if (status === 200) {
        this.total = data.total
        this.list = data.users
        this.loading = false
        // console.log(this.list)
      }else{
          // token 失效
        //   this.$message.warning(msg)
      }
    }
  }
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
