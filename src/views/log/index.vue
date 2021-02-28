<template>
  <div class="block">
    <span v-if="logs.length === 0">日志空空如也~</span>
    <el-timeline>
      <el-timeline-item
        :timestamp="formatDate(log.operateAt)"
        placement="top"
        v-for="log in logs"
        :key="log.id"
        :type="getTimeType(log.result)"
        size="large"
      >
        <el-card :style="{ borderColor: log.result === 'success' ? '#02C39A' : '#F25F5C' }">
          <div slot="header" class="clearfix">
            <h6 style="font-weight: bolder">{{ log.ip }} -> {{ getLogType(log) }} -> {{ getLogOperation(log) }} -> {{ getResult(log) }}</h6>
          </div>
          <div class="info-box">
            <div class="users">
              <div><span>操作者：</span>{{ log.operator }}</div>
              <div v-if="log.target.includes('http')"><span>目标者：</span><a :href="log.target" target="_blank">链接</a></div>
              <div v-else><span>目标者：</span>{{ log.target }}</div>
            </div>
            <div class="log-info">
              <div><span>备注：</span>{{ log.remark }}</div>
              <div><span>原因：</span>{{ log.resaon }}</div>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-size="limit"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  const moment = require('moment');
  const { getLogs } = require('../../request');
  const { getStorage } = require('../../common');
  export default {
    name: 'log',
    data() {
      return {
        operator: getStorage('userName'),
        logs: [],
        //当前页码
        curPage: 1,
        //每页显示条数
        limit: 10,
        total: 0
      };
    },
    methods: {
      formatDate(date) {
        return moment(date).format('YYYY-MM-DD -> HH:mm:ss');
      },
      getTimeType(ret) {
        if (ret === 'success') {
          return ret;
        }
        return ret === 'fail' ? 'warning' : 'danger';
      },
      getBorderColor(ret) {
        if (ret === 'success') {
          return '#02C39A';
        }
        return ret === 'fail' ? '#FF9F1C' : '#F25F5C';
      },
      getLogOperation(ret) {
        switch (ret.operation) {
          case 'increase':
            return '增加';
          case 'update':
            return '更新';
          case 'delete':
            return '删除';
          case 'list':
            return '查看';
          default:
            return ret.operation;
        }
      },
      getLogType(ret) {
        switch (ret.type) {
          case 'article':
            return '文章管理';
          case 'user':
            return '用户管理';
          case 'ghs':
            return '视频管理';
          default:
            return ret.type;
        }
      },
      getResult(ret) {
        switch (ret.result) {
          case 'success':
            return '成功';
          case 'fail':
            return '失败';
          case 'error':
            return 'error';
          default:
            return 'unknow';
        }
      },
      handleSizeChange(val) {
        this.limit = val;
        this._getLogs(this.operator, this.curPage, this.limit);
      },
      handleCurrentChange(val) {
        this.curPage = val;
        this._getLogs(this.operator, this.curPage, this.limit);
      },
      //网络请求相关
      _getLogs(operator, curPage, limit) {
        getLogs(operator, curPage, limit)
          .then(res => {
            if (res.msg === 'success') {
              this.logs = res.logs;
              this.total = res.total;
              this.$message.success(res.data);
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    created() {
      this._getLogs(this.operator, this.curPage, this.limit);
    }
  };
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .info-box {
    display: flex;
    justify-content: space-around;
  }
  .users,
  .log-info {
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .users span,
  .log-info span {
    font-weight: bold;
  }
</style>
