<template>
    <el-card class="box">
        <cus-Bread level1="权限管理" level2="角色列表"></cus-Bread>
        <el-button @click="showDiaAddRoles()" class="btn" type="primary">添加角色</el-button>

        <!-- 表格 -->
        <!-- <el-table height="450px" :data="roleData" style="width: 100%">
            <el-table-column type="index" label="#" width="160">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="200">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="200">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="showDiaEditRoles(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="showMsgBox(scope.row)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button @click="showDiaSetRole(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
                </template>
            </el-table-column>
        </el-table> -->
        <el-table :data="roles" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row class="level1" v-for='(item1) in scope.row.children' :key='item1.id'>
                        <el-col :span="4">
                            <el-tag @close="deleRights(scope.row,item1)" type="danger" closable>{{item1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row class="level2" v-for='(item2) in item1.children' :key='item2.id'>
                                <el-col :span="4">
                                    <el-tag @close="deleRights(scope.row,item2)" type="info" closable>{{item2.authName}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag @close="deleRights(scope.row,item3)" class="level3" closable v-for='(item3) in item2.children' :key='item3.id' type="warning">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="scope.row.children.length===0">
                        <el-col>
                            <span>未分配权限</span>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="160">
            </el-table-column>
            <el-table-column label="角色名称" prop="roleName" width="200">
            </el-table-column>
            <el-table-column label="角色描述" prop="roleDesc" width="200">
            </el-table-column>
            <el-table-column label="操作" width="360">
                <template slot-scope="scope">
                    <el-button @click="showDiaEditRoles(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="showMsgBox(scope.row)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button @click="showDiaSetRole(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加角色 - 表格 -->
        <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
            <el-form label-position="left" label-width="80px" :model="formdata">
                <el-form-item label="角色名称">
                    <el-input v-model="formdata.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="formdata.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addRoles()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑角色 - 对话框 -->
        <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
            <el-form label-position="left" label-width="80px" :model="formdata">
                <el-form-item label="角色名称">
                    <el-input v-model="formdata.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="formdata.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editRoles()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 对话框  非配权限-->
        <el-dialog title="分配权限" :visible.sync="dialogFormVisibleCheck">
            <!-- node-key 每个节点唯一标示 ,值来源于treedata中的key名 -->
            <el-tree :data="treeData" ref="treeDom" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrCheck" :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleCheck = false">取 消</el-button>
                <el-button type="primary" @click="setRights()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      roles: [],
      formdata: {
        roleName: '',
        roleDesc: ''
      },
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleCheck: false,
      // 树形绑定的数据
      treeData: [],
      // 默认展开的数据 {被展开节点的id}

      // 默认选中的数据[被选中节点的id]
      arrCheck: [],
      // 配置选项
      defaultProps: {
        // label 和children的值来源于树形结构绑定数据treedata中的key名
        label: 'authName',
        children: 'children'
      },
      // 当前角色id
      currRoleId: -1
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 分配权限
    async setRights () {
      // 获取全选节点id

      // 获取半选节点id
      const arr1 = this.$refs.treeDom.getCheckedKeys()
      // 获取树形结构中半选id
      // getHalfCheckedKeys
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys()
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisibleCheck = false
        this.getTableData()
      }
    },
    // 分配权限
    async showDiaSetRole (role) {
      this.currRoleId = role.id
      const res = await this.$http.get(`rights/tree`)
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.treeData = data

        // 获取当前角色有的权限
        // const temp = []
        // 预演 ->
        // this.treeData.forEach((item1)=>{
        //     temp.push(item1.id)
        //     item1.children.forEach((item2)=>{
        //         temp.push(item2.id)
        //         item2.children.forEach((item3)=>{
        //             temp.push(item3.id)
        //         })
        //     })
        // })
        // this.arrExpand = temp
        // 去除每一层节点的id -> arrExpand

        // 默认选中->全选节点+半选节点->arrCheck[全选节点id+半选节点id]
        // 获取树形结构中全选id -> 操作第三方组件->el-tree->组件API
        // getCheckedKeys

        // const arr1 = this.$refs.treeDom.getCheckedKeys()
        // // 获取树形结构中半选id
        // // getHalfCheckedKeys
        // const arr2 = this.$refs.treeDom.getHalfCheckedKeys()
        // this.arrCheck= [arr1,arr2]
      }
      const temp = []
      role.children.forEach((item1) => {
        // temp.push(item1.id)
        item1.children.forEach((item2) => {
          // temp.push(item2.id)
          item2.children.forEach((item3) => {
            temp.push(item3.id)
          })
        })
      })
      // const res2 = await this.$http.get(`roles`)
      this.arrCheck = temp

      this.dialogFormVisibleCheck = true
    },
    // 取消权限
    async deleRights (role, rights) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`)
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.$message.success(msg)
        role.children = data
      }
    },
    // 分配角色
    // 编辑 - 发送请求
    async editRoles () {
      const res = await this.$http.put(`roles/${this.formdata.id}`, this.formdata)
      console.log(res)
      // 使用this.formdata  必须确保是有值的
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.dialogFormVisibleEdit = false
        this.$message.success(msg)
        this.getTableData()
      } else {
        this.$message.error(msg)
      }
    },
    // 编辑 - 显示弹出框
    async showDiaEditRoles (roles) {
      const res = await this.$http.get(`roles/${roles.id}`)
      this.formdata.id = roles.id
      // 使用this.formdata  必须确保是有值的
      this.formdata.roleName = roles.roleName
      this.formdata.roleDesc = roles.roleDesc
      // this.formdata = res.data.data
      this.dialogFormVisibleEdit = true
    },
    // 角色列表 - 添加角色
    // 添加用户-发送请求
    async addRoles () {
      // 获取表单数据  发送请求
      const res = await this.$http.post(`roles`, this.formdata)
      // console.log(res)
      const { meta: { msg, status } } = res.data
      // 关闭对话框
      if (status === 201) {
        this.$message.success(msg)
        this.dialogFormVisibleAdd = false
        // 更新表格
        this.getTableData()
      }
    },
    // 添加用户-展示对话框
    showDiaAddRoles () {
      this.formdata = {}
      this.dialogFormVisibleAdd = true
    },
    // 删除角色
    async showMsgBox (roles) {
      this.$confirm('是否删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送请求
          const res = await this.$http.delete(`roles/${roles.id}`)
          const { meta: { msg, status } } = res.data
          if (status === 200) {
            // 提示框
            this.$message.success(msg)
            this.getTableData()
          }
        }).catch(() => {
          this.$message.info('已取消删除')
        })
    },
    async getTableData () {
      const res = await this.$http.get(`roles`)
      // console.log(res)
      const { meta: { status, msg }, data } = res.data
      if (status === 200) {
        this.roles = data
      }
    }
    // // 展开按钮
    // showDiaSetRole() {
    //     dialogFormVisibleooo: true
    // },
  }
}
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 40px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.level1,
.level2,
.level3 {
  margin-top: 5px;
  margin-right: 5px;
}
</style>
