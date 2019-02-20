<template>
    <el-card class="box">
        <cus-bread level1='商品管理' level2='商品列表'></cus-bread>
        <el-alert class="alert" :closable="false" center title="添加商品信息" type="info" show-icon>
        </el-alert>
        <el-steps :active="active*1" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>

        <el-form class="form" label-position="top" label-width="80px" :model="form">

            <!-- tabs 标签页 -->
            <el-tabs v-model="active" tab-position="left" @tab-click="changeTab()">

                <el-tab-pane label="基本信息" name="1">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-cascader 
                        clearable 
                        expand-trigger="hover" 
                        :options="options" 
                        v-model="selectedOptions" 
                        @change="handleChange" 
                        :props="defaultProp">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="2">
                    <el-form-item :label="item1.attr_name" 
                    v-for="(item1) in arrDy" :key="item1.attr_id">
                        <!-- {{checkList}} -->
                        <el-checkbox-group v-model="item1.attr_vals">
                            <el-checkbox border 
                            :label="item2" 
                            v-for="(item2,i) in item1.attr_vals" 
                            :key="i"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="3">
                    <el-form-item :label="item.arr_name" 
                    v-for="(item) in arrStatic" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="4">
                    <el-form-item label="添加图片">
                        <!-- headers设置请求头 -->
                        <!-- 1. 必须全路径
                             2. 必须授权(之前axios的API设置的headers)
                         -->
                        <el-upload class="upload-demo" :headers="headers" action="http://localhost:8888/api/private/v1/upload" 
                        :on-remove="handleRemove" 
                        :on-success="handeSuccess" 
                        list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="5">
                    <el-form-item>
                        <el-button @click="addGoods()">添加商品</el-button>
                        <!-- vue项目中的富文本 -->
                        <quill-editor v-model="form.goods_introduce"></quill-editor>

                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
    components: {
        quillEditor
    },
    data() {
        return {
            active: '1',
            // 添加商品请求时的请求体
            form: {
                goods_name: '',
                goods_cat: '',
                goods_price: '',
                goods_weight: '',
                goods_number: '',
                goods_introduce: '',
                pics: '',
                attrs: '',
                pics: [],
                attrs: []
            },
            // 级联配置的数据
            options: [],
            selectedOptions: [1, 3, 6],
            defaultProp: {
                label: 'cat_name',
                value: 'cat_id',
                // children: 'children'
            },
            // checkList:[],
            // 动态参数的数组
            arrDy: [],
            // 静态参数的数组
            arrStatic: [],
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }
    },
    created() {
        this.getGoodsCate()
    },
    methods: {
        // 添加商品
        async addGoods() {
            this.form.goods_cat = this.selectedOptions.join(",")
            // this.pics
            // 处理动态
            const arr1 = this.arrDy.map(item => {
                return { arr_id: item.attr_id, arr_value: item.attr_vals }
            })

            // 处理静态
            const arr2 = this.arrStatic.map(item => {
                return { arr_id: item.attr_id, arr_value: item.attr_vals }
            })
            this.form.attrs = [...arr1, ...arr2]
            // 发送请求
            const res = await this.$http.post(`goods`, this.form)
            console.log(res)
            const { meta: { msg, status } } = res.data
            if (status === 201) {
                this.$router.push({
                    name: "goods"
                })
                this.$message.success(msg)
            } else {
                this.$message.error(msg)
            }
        },
        // 移除x
        handleRemove(file, fileList) {
            const Index = this.form.pics.findIndex(item => {
                return item.pic === file.response.data.tmp_path
            })
            // 图片上传的临时路径->在aoi-server/tmp_uploads临时路径
            this.form.pics.splice(Index, 1)
            // file.response.data.tmp_path
        },
        // 假上传成功
        handeSuccess(res, file, fileList) {
            // 图片上传的临时路径->在aoi-server/tmp_uploads临时路径
            // res.data.data.tmp_path
            const tmpPath = res.data.tmp_path
            this.form.pics.push({
                pic: tmpPath
            })
        },
        // 商品参数
        async changeTab() {

            // 点击第二个
            // 如果分类是三级
            if (this.active === "2" || this.active === "3") {
                if (this.selectedOptions.length !== 3) {
                    this.$message.error("请先选择三级分类")
                    // 清空
                    if (this.active === "2") {
                        this.arrDy = []
                    }else{
                        this.arrStatic = []
                    }
                    return;
                }
                // 获取动态数据
                if (this.active === "2") {
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
                // 获取静态数据
                if (this.active === "3") {
                    const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                    const { meta: { msg, status }, data } = res.data
                    if (status === 200) {
                        // 处理this.arrDy中的每个元素的attr_vals
                        this.arrStatic = data
                    }
                }

            }
        },


        // 获取三级分类的数据
        async getGoodsCate() {
            // type的值[1,2,3]
            const res = await this.$http.get(`categories?type=3`)
            const { meta: { msg, status }, data } = res.data
            if (status === 200) {
                this.options = data
            }
        },
        handleChange() { }
    },
}

</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  height: 400px;
  overflow: auto;
}
.ql-editor,
.ql-blank {
  /* height: 200px; */
  min-height: 200px;
}
</style>
