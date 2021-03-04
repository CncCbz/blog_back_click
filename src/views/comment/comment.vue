<template>
  <div>
    <div class="filterForm">
      <el-form :inline="true" size="mini" :model="filter">
        <el-form-item label="文章标题">
          <el-input v-model="filter.articleTitle" placeholder="文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章作者" v-if="isAdmin">
          <el-input v-model="filter.autherName" placeholder="文章作者"></el-input>
        </el-form-item>
        <el-form-item label="被置顶">
          <el-select v-model="filter.top_status" placeholder="是否被置顶">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="被举报">
          <el-select v-model="filter.isReported" placeholder="是否被举报">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="mini" :model="filter">
        <el-form-item label="评论角色">
          <el-select v-model="filter.userRole" placeholder="评论角色">
            <el-option v-for="item in options" :key="item.role" :label="item.rolename" :value="item.role"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论者">
          <el-input v-model="filter.userName" placeholder="评论者"></el-input>
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input v-model="filter.content" placeholder="评论内容"></el-input>
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
            <el-form-item label="作者ID">
              <span>{{ props.row.autherId }}</span>
            </el-form-item>
            <el-form-item label="已删除" v-if="isAdmin">
              <span :style="{ color: props.row.isDeleted ? 'red' : '' }">{{ props.row.isDeleted ? '是' : '否' }}</span>
            </el-form-item>
            <el-form-item label="删除时间" v-if="isAdmin">
              <span>{{ props.row.deleteAt }}</span>
            </el-form-item>
            <el-form-item label="被置顶">
              <span :style="{ color: props.row.top_status ? 'red' : '' }">{{ props.row.top_status ? '是' : '否' }}</span>
            </el-form-item>
            <el-form-item label="评论者ID">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
            <el-form-item label="评论者角色">
              <span>{{ getRole(props.row.userRole) }}</span>
            </el-form-item>
            <el-form-item label="被举报">
              <span :style="{ color: props.row.isReported ? 'red' : '' }">{{ props.row.isReported ? '是' : '否' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" sortable="custom" width="60"> </el-table-column>
      <el-table-column prop="articleTitle" label="文章标题" sortable="custom" width="150"> </el-table-column>
      <el-table-column prop="autherName" label="作者" sortable="custom" width="100"> </el-table-column>
      <el-table-column prop="content" label="评论内容"> </el-table-column>
      <el-table-column prop="likes" label="点赞" sortable="custom" width="80"> </el-table-column>
      <el-table-column prop="createdAt" label="日期" sortable="custom" width="160"> </el-table-column>
      <el-table-column prop="userName" label="评论者" sortable="custom" width="100"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.top_status" @click="setTopStatus(scope.row)" type="text" size="small">置顶</el-button>
          <el-button v-else @click="setTopStatus(scope.row)" type="text" size="small" style="color:red">取消置顶</el-button>
          <el-button v-if="!scope.row.isDeleted" @click="deleteComment(scope.row)" type="text" size="small">删除</el-button>
          <el-button v-else @click="deleteComment(scope.row)" type="text" size="small" style="color:red">恢复</el-button>
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
  const { getRoles, getComments, setTopStatus, deleteComment } = require('../../request');
  const { getStorage } = require('../../common');
  export default {
    name: '',
    data() {
      return {
        userName: getStorage('userName'),
        role: getStorage('role'),
        tableData: [],
        filter: {},
        //角色选择列表
        options: [],
        //当前页码
        curPage: 1,
        //每页显示条数
        limit: 10,
        total: 0,
        sort: {}
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
      //表格筛选与排序
      sortChange(data) {
        this.sort = {};
        this.sort[data.prop] = data.order;
        this._getComments(this.userName, this.curPage, this.limit, this.sort);
      },
      handleSizeChange(val) {
        this.limit = val;
        this._getComments(this.userName, this.curPage, this.limit, this.sort);
      },
      handleCurrentChange(val) {
        this.curPage = val;
        this._getComments(this.userName, this.curPage, this.limit, this.sort);
      },
      //操作评论
      setTopStatus(row) {
        console.log(row);
        this._setTopStatus(this.userName, !row.top_status, row.id, row.articleId);
      },
      deleteComment(row) {
        console.log(row);
        this._deleteComment(this.userName, row.userName, !row.isDeleted, row.id, row.articleId);
      },
      //查询与清除查询
      onSubmit() {
        console.log('submit!');
        this._getComments(this.userName, this.curPage, this.limit, this.sort, this.filter);
      },
      clearForm() {
        this.filter = {};
        this._getComments(this.userName, this.curPage, this.limit, this.sort, this.filter);
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
      _getComments(userName, curPage, limit, sort, filter) {
        getComments(userName, curPage, limit, sort, filter)
          .then(ret => {
            this.total = ret.count;
            this.tableData = ret.comments;
            // console.log(ret);
          })
          .catch(err => {
            console.log(err);
          });
      },
      _setTopStatus(userName, status, id, articleId) {
        setTopStatus(userName, status, id, articleId)
          .then(res => {
            if (res.msg === 'success') {
              this.$message.success(res.data);
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            this.$message.error('Error');
            console.log(err);
          })
          .finally(() => {
            this._getComments(this.userName, this.curPage, this.limit, this.sort);
          });
      },
      _deleteComment(userName, targetName, isDeleted, id, articleId) {
        deleteComment(userName, targetName, isDeleted, id, articleId)
          .then(res => {
            if (res.msg === 'success') {
              this.$message.success(res.data);
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            this.$message.error('Error');
            console.log(err);
          })
          .finally(() => {
            this._getComments(this.userName, this.curPage, this.limit, this.sort);
          });
      }
    },
    created() {
      this._getComments(this.userName, this.curPage, this.limit, this.sort);
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
