<template>
  <div>
    <div class="filterForm">
      <el-form :inline="true" size="mini" :model="filter">
        <el-form-item label="文章标题">
          <el-input v-model="filter.articleTitle" placeholder="文章标题"></el-input>
        </el-form-item>
        <el-form-item label="拥有者">
          <el-input v-model="filter.replyName" placeholder="拥有者"></el-input>
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input v-model="filter.replyContent" placeholder="评论内容"></el-input>
        </el-form-item>
        <el-form-item label="被举报">
          <el-select v-model="filter.isReported" placeholder="是否被举报">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="mini" :model="filter">
        <el-form-item label="回复角色">
          <el-select v-model="filter.userRole" placeholder="回复角色">
            <el-option v-for="item in options" :key="item.role" :label="item.rolename" :value="item.role"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回复者">
          <el-input v-model="filter.userName" placeholder="回复者"></el-input>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input v-model="filter.content" placeholder="回复内容"></el-input>
        </el-form-item>
        <el-form-item label="被删除" v-if="isAdmin">
          <el-select v-model="filter.isDeleted" placeholder="是否被删除">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="clearForm">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" border style="width: 100% " @sort-change="sortChange">
      <el-table-column width="50" type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="文章ID">
              <span>{{ props.row.articleId }}</span>
            </el-form-item>
            <el-form-item label="被举报">
              <span :style="{ color: props.row.isReported ? 'red' : '' }">{{ props.row.isReported ? '是' : '否' }}</span>
            </el-form-item>
            <el-form-item label="已删除" v-if="isAdmin">
              <span :style="{ color: props.row.isDeleted ? 'red' : '' }">{{ props.row.isDeleted ? '是' : '否' }}</span>
            </el-form-item>
            <el-form-item label="删除时间" v-if="isAdmin">
              <span>{{ props.row.deleteAt }}</span>
            </el-form-item>
            <el-form-item label="回复者ID">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
            <el-form-item label="回复者角色">
              <span>{{ getRole(props.row.userRole) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" sortable="custom" width="60"> </el-table-column>
      <el-table-column prop="articleTitle" label="文章标题" sortable="custom" width="150"> </el-table-column>
      <el-table-column prop="replyContent" label="评论" width="150"> </el-table-column>
      <el-table-column prop="replyName" label="拥有者" sortable="custom"> </el-table-column>
      <el-table-column prop="content" label="回复内容" width="150"> </el-table-column>
      <el-table-column prop="userName" label="回复者" sortable="custom" width="100"> </el-table-column>
      <el-table-column prop="likes" label="点赞" sortable="custom" width="80"> </el-table-column>
      <el-table-column prop="createdAt" label="日期" sortable="custom" width="160"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.top_status" @click="shwo(scope.row)" type="text" size="small">查看</el-button>
          <el-button v-if="!scope.row.isDeleted" @click="deleteReply(scope.row)" type="text" size="small">删除</el-button>
          <el-button v-else @click="deleteReply(scope.row)" type="text" size="small" style="color:red">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  const { getReplys, deleteRelpy, getRoles } = require('../../request');
  const { getStorage } = require('../../common');
  export default {
    name: '',
    data() {
      return {
        userName: getStorage('userName'),
        role: getStorage('role'),
        //当前页码
        curPage: 1,
        //每页显示条数
        limit: 10,
        total: 0,
        sort: {},
        filter: {},
        tableData: [],
        //角色选择列表
        options: []
      };
    },
    methods: {
      //获取角色列表
      getRole(role) {
        switch (role) {
          case 'user':
            return '用户';
          case 'admin':
            return '管理员';
          case 'test':
            return '测试用户';
          case 'superAdmin':
            return '超级管理员';
        }
      },
      //查询与清除查询
      onSubmit() {
        console.log('submit!');
        this.curPage = 1;
        this._getReplys(this.userName, this.curPage, this.limit, this.sort, this.filter);
      },
      clearForm() {
        this.filter = {};
        this.curPage = 1;
        this._getReplys(this.userName, this.curPage, this.limit, this.sort, this.filter);
      },
      //表格筛选与排序
      sortChange(data) {
        this.sort = {};
        this.sort[data.prop] = data.order;
        this._getReplys(this.userName, this.curPage, this.limit, this.sort, this.filter);
      },
      handleSizeChange(val) {
        this.limit = val;
        this._getReplys(this.userName, this.curPage, this.limit, this.sort, this.filter);
      },
      handleCurrentChange(val) {
        this.curPage = val;
        this._getReplys(this.userName, this.curPage, this.limit, this.sort, this.filter);
      },
      //操作按钮
      shwo(row) {
        console.log(row);
        this.$message.success('暂不支持跳转！');
      },
      deleteReply(row) {
        this._deleteRelpy(this.userName, row.userName, !row.isDeleted, row.id, row.replyId);
      },
      //网络请求相关
      _getRoles(userName) {
        getRoles(userName)
          .then(res => {
            this.options = res.roles;
          })
          .catch(err => {
            console.log(err);
          });
      },
      _getReplys(userName, curPage, limit, sort, filter) {
        getReplys(userName, curPage, limit, sort, filter)
          .then(res => {
            this.tableData = res.replys;
            this.total = res.count;
          })
          .catch(err => {
            console.log(err);
            this.$message.error('获取列表出错！');
          });
      },
      _deleteRelpy(userName, targetName, isDeleted, id, replyId) {
        deleteRelpy(userName, targetName, isDeleted, id, replyId)
          .then(res => {
            console.log(res);
            if (res.msg === 'success') {
              this.$message.success(res.data);
              this._getReplys(this.userName, this.curPage, this.limit, this.sort, this.filter);
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('Error');
          });
      }
    },
    created() {
      this._getReplys(this.userName, this.curPage, this.limit, this.sort, this.filter);
      this._getRoles(this.userName);
    },
    computed: {
      isAdmin() {
        return this.role === 'superAdmin' || this.role === 'admin';
      }
    }
  };
</script>

<style scoped>
  .filterForm {
    display: flex;
    flex-direction: column;
    /* align-items: flex-end; */
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
  .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
</style>
