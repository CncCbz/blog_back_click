<template>
  <div>
    <el-table :data="tableData" style="width: 100%" height="80vh">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="文章ID：">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="描述：">
              <span>{{ props.row.previewText }}</span>
            </el-form-item>
            <el-form-item label="点赞数：">
              <span>{{ props.row.likes }}</span>
            </el-form-item>
            <el-form-item label="评论数：">
              <span>{{ props.row.comment }}</span>
            </el-form-item>
            <el-form-item label="最后更新时间：">
              <span>{{ props.row.updated_at }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="created_at" sortable> </el-table-column>
      <el-table-column label="标题" prop="title" sortable> </el-table-column>
      <el-table-column label="作者" prop="auther" sortable> </el-table-column>
      <el-table-column label="标签">
        <template slot-scope="props">
          <el-tag
            style="margin:2px 5px"
            v-for="(tag, index) in props.row.tags"
            :type="randomTagType(Math.floor(Math.random() * 5))"
            :key="tag + index"
            disable-transitions
            >{{ tag }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  const { getArticleList, deleteArticle } = require('../../request');
  const { getStorage } = require('../../common');
  export default {
    name: 'articleList',
    data() {
      return {
        userName: getStorage('userName'),
        role: getStorage('role'),
        tableData: [],
        //当前页码
        curPage: 1,
        //每页显示条数
        limit: 10,
        total: 0,
        search: ''
      };
    },
    methods: {
      handleEdit(index, row) {
        this.$router.push({
          path: '/article-edit',
          query: {
            id: row.id //取出路由上的参数列表
          }
        });
      },
      handleDelete(index, row) {
        this.$confirm('确认删除文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this._deleteArticle(this.userName, row.id);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      handleSizeChange(val) {
        this.limit = val;
        this._getArticleList(this.userName, this.curPage, this.limit);
      },
      handleCurrentChange(val) {
        this.curPage = val;
        this._getArticleList(this.userName, this.curPage, this.limit);
      },
      //网络请求相关
      _getArticleList(userName, curPage, limit) {
        getArticleList(userName, curPage, limit)
          .then(res => {
            if (res.msg === 'success') {
              for (let item of res.list) {
                item.tags = item.tags.split(',');
              }
              this.total = res.total;
              this.tableData = res.list;
              // this.$message.success(res.data);
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('Error');
          });
      },
      _deleteArticle(operator, id) {
        deleteArticle(operator, id)
          .then(res => {
            if (res.msg === 'success') {
              this.$message.success(res.data);
              this.tableData.splice(
                this.tableData.findIndex(item => item.id === id),
                1
              );
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
    mounted() {
      this._getArticleList(this.userName, this.curPage, this.limit);
    },
    computed: {
      randomTagType() {
        const types = ['', 'success', 'info', 'warning', 'danger'];
        return random => types[random];
      },
      isSuperAdmin() {
        return this.role === 'superAdmin' || this.role === 'test';
      },
      isAdmin() {
        return this.role === 'superAdmin' || this.role === 'test' || this.role === 'admin';
      }
    }
  };
</script>

<style scoped>
  .block {
    margin-top: 4px;
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
</style>
