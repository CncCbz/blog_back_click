<template>
  <div class="main">
    <div class="carousel">
      <el-carousel height="30vh">
        <el-carousel-item v-for="item in carousel" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="charts">
      <div class="visit" ref="main" id="main"></div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  const { getVisitors } = require('../../request');
  export default {
    name: 'home',
    data() {
      return {
        carousel: ['这是一个博客后台管理系统', 'Welcome', 'to', 'my', 'blog'],
        option: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ['发布文章数', '访问次数']
          },
          xAxis: {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis: [
            {
              type: 'value',
              name: '发布文章数',
              min: 0,
              max: 20,
              interval: 5,
              axisLabel: {
                formatter: '{value} 篇'
              }
            },
            {
              type: 'value',
              name: '访问次数',
              min: 0,
              max: 50,
              interval: 10,
              axisLabel: {
                formatter: '{value} 次'
              }
            }
          ],
          series: [
            {
              name: '发布文章数',
              type: 'bar',
              data: []
            },
            {
              name: '访问次数',
              type: 'line',
              yAxisIndex: 1,
              data: []
            }
          ]
        }
      };
    },
    methods: {
      initChart(domName, option) {
        const chartDom = this.$refs[domName];
        const myChart = echarts.init(chartDom);
        option && myChart.setOption(option);
      },
      //网络请求相关
      _getVisitors() {
        getVisitors()
          .then(res => {
            const { dates, issues, visits } = res;
            this.option.xAxis.data = dates;
            this.option.series[0].data = issues;
            this.option.series[1].data = visits;
            console.log(res);
            this.initChart('main', this.option);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    created() {
      this._getVisitors();
    }
    // mounted() {
    //   this.initChart('main', this.option);
    // }
  };
</script>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
  }
  .charts {
    margin-top: 4vh;
    display: flex;
  }
  .visit {
    width: 50%;
    height: 50vh;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>
