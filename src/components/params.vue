<template>
    <el-card class="box">
        <cus-Bread level1="商品管理" level2="分类参数"></cus-Bread>
        <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
        <el-form class="form" label-position="left" label-width="140px" :model="form">
            <el-form-item label="请选择商品分类">
                <el-cascader clearable expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp">
                </el-cascader>
            </el-form-item>
        </el-form>
        <el-tabs type="border-card" v-model="active" @tab-click="changeTab()">
            <el-tab-pane name="1" label="动态参数">
                <el-button disabled>设置动态参数</el-button>
                <el-table height="450px" border stripe :data="arrDy" style="width: 100%">
                    <el-table-column type="expand" width="140">
                        <template slot-scope="scope">
                            <el-tag :key="i" v-for="(attr,i) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row,attr)">
                                {{attr}}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column type="index" label="#" width="120">
                    </el-table-column>

                    <el-table-column prop="attr_name" label="属性名称" width="240">
                    </el-table-column>

                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                            <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2" label="静态参数">
                <el-button disabled>设置静态参数</el-button>
                <el-table height="350px" border stripe :data="arrStatic" style="width: 100%">

                    <el-table-column type="index" label="#" width="120">
                    </el-table-column>

                    <el-table-column prop="attr_name" label="属性名称" width="240">
                    </el-table-column>
                    <el-table-column prop="attr_vals" label="属性值" width="240">
                    </el-table-column>

                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                            <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            active: "1",
            form: {

            },
            options: [],
            selectedOptions: [],
            defaultProp: {
                label: 'cat_name',
                value: 'cat_id',
            },
            arrDy: [],
            // 动态tag 编辑用的数据
            inputVisible: false,
            inputValue: '',
            arrStatic: []
        }
    },
    created() {
        this.getGoodsCate()
    },
    methods: {
        // 删除attr_Vals中的值
        async handleClose(item, attr) {
            item.attr_vals.splice(item.attr_vals.indexOf(attr), 1);
            const res = await this.$http.put(
                `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
                {
                    attr_name: item.attr_name,
                    attr_sel: "many",
                    attr_vals: item.attr_vals.join(",")
                }
            )
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async handleInputConfirm(item) {
            let inputValue = this.inputValue;
            if (inputValue) {
                item.attr_vals.push(inputValue);
                const res = await this.$http.put(
                    `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
                    {
                        attr_name: item.attr_name,
                        attr_sel: "many",
                        attr_vals: item.attr_vals.join(",")
                    }
                )
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 获取三级分类
        async getGoodsCate() {
            // type的值[1,2,3]
            const res = await this.$http.get(`categories?type=3`)
            const { meta: { msg, status }, data } = res.data
            if (status === 200) {
                this.options = data
            }
        },
        // 级联选择器选中时
        handleChange() {
            this.getDyOrStatic()
        },
        changeTab() {
            this.getDyOrStatic()
        },
        // 获取动态/静态数据
        async getDyOrStatic() {
            if (this.selectedOptions.length !== 3) {
                this.$message.warning('请先选第三级分类')
                if (this.active === "1") {
                    this.arrDy = []
                }
                if (this.active === "2") {
                    this.arrStatic = []
                }
                return
            }
            // 获取动态数据
            if (this.active === "1") {
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                const { meta: { msg, status }, data } = res.data
                if (status === 200) {
                    // 处理this.arrDy中的每个元素的attr_vals
                    this.arrDy = data
                    this.arrDy.forEach(item => {
                        item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(",")
                        // item.attr_vals = item.attr_vals.trim().split(",")
                    })
                }
            }
            if (this.active === "2") {
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                const { meta: { msg, status }, data } = res.data
                if (status === 200) {
                    // 处理this.arrDy中的每个元素的attr_vals
                    this.arrStatic = data
                }
            }
        }
    },
}
</script>

<style>
.box {
  height: 100%;
}
.form,
.alert {
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
