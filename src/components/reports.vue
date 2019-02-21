<template>
    <el-card class="box">
        <cus-bread level1='数据统计' level2='数据报表'></cus-bread>
        <div id="main" style="width: 600px; height:400px;"></div>
    </el-card>
</template>

<script>
import MyEcharts from 'echarts'
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.initEcharts()
    },
    methods: {
        async initEcharts() {
            // 基于准备好的dom，初始化echarts实例
            const myChart = MyEcharts.init(document.getElementById('main'));
            // 请求数据
            const res = await this.$http.get(`reports/type/1`)
            const option2 = res.data.data
            
            // 绘制图表
            const option1 = {
                title: {
                    text: '我就是图示阿'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            };
            const option = {...option1,...option2}
            myChart.setOption(option)
        }
    },
}
</script>

<style>
.box {
  height: 100%;
}
</style>
