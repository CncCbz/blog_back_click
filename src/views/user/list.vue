<template>
  <div class="main">
    <el-table
      :data="users.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%;border-radius: 4px;"
      @selection-change="handleSelectionChange"
      v-if="showTable"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="ID" prop="id" width="80" sortable> </el-table-column>
      <el-table-column label="用户名" prop="username" width="150" sortable> </el-table-column>
      <el-table-column v-if="isSuperAdmin" label="密码" prop="password"> </el-table-column>
      <el-table-column prop="role" label="角色" width="150" :filters="roles" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="tagType(scope.row.role)" disable-transitions>{{ scope.row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" width="200" sortable> </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <div style="display:flex;">
            <el-input style="margin-right: 10%;" v-model="search" size="mini" placeholder="关键字搜索" />
            <el-button size="mini" type="success" @click="handleAddUser" :disabled="!isAdmin">添加</el-button>
            <el-button size="mini" type="danger" @click="handleDeleteMul(multipleSelection)" :disabled="!isAdmin">删除选中</el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" :disabled="!isAdmin">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" :disabled="!isAdmin">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑用户信息"
      :visible.sync="dialogFormVisible"
      width="30%"
      :center="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <el-form :model="form">
        <el-form-item label="用户ID" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off" style="width:20%" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="用户" value="user"></el-option>
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="测试人员" value="test"></el-option>
            <el-option label="超级管理员" value="superAdmin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const { getUsers, editUser, deleteUser, deleteUsers } = require('@/request');
  export default {
    name: 'userList',
    data() {
      return {
        showTable: true,
        userName: window.sessionStorage.getItem('userName'),
        role: window.sessionStorage.getItem('role'),
        users: [],
        search: '',
        multipleSelection: [], //选中项的ID,
        dialogFormVisible: false,
        form: {},
        formLabelWidth: '25%'
      };
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = [];
        for (let item of val) {
          this.multipleSelection.push(item.id);
        }
      },
      handleEdit(index, row) {
        this.dialogFormVisible = true;
        this.form = row;
      },
      handleAddUser() {
        console.log('添加用户');
      },
      handleDelete(index, row) {
        const operator = this.userName;
        const { id } = row;
        this.$confirm('确认删除用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this._deleteUser(operator, id);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      handleDeleteMul(list) {
        const operator = this.userName;
        const ids = this.multipleSelection;
        this.$confirm('确认删除这些用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this._deleteUsers(operator, ids);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      filterTag(value, row) {
        return row.role === value;
      },
      tagType(role) {
        switch (role) {
          case 'user':
            return 'success';
          case 'admin':
            return '';
          case 'test':
            return 'warning';
          case 'superAdmin':
            return 'danger';
        }
      },
      subForm() {
        if (!this.isAdmin) {
          this.$message.error('您没有修改权限!');
          return;
        }
        this.$confirm('确认提交更改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this._editUser(this.userName, this.form);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      //网络请求相关
      _getUsers(userName) {
        getUsers(userName)
          .then(res => {
            if (res.msg === 'success') {
              this.users = res.users;
            } else {
              //user权限用户看到的测试数据
              this.users = [
                { id: 1, username: 'test', password: '', role: 'user', create_time: '2021-02-11T13:13:21.000Z' },
                { id: 2, username: 'test', password: '', role: 'admin', create_time: '2021-02-11T13:13:21.000Z' },
                { id: 3, username: 'test', password: '', role: 'superAdmin', create_time: '2021-02-11T13:13:21.000Z' }
              ];
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('获取用户列表出错！');
          });
      },
      _deleteUser(operator, id) {
        deleteUser(operator, id)
          .then(res => {
            if (res.msg === 'success') {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.users.splice(
                this.users.findIndex(user => user.id === id),
                1
              );
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('删除出错！');
          });
      },
      _editUser(operator, form) {
        editUser(operator, form)
          .then(res => {
            if (res.msg === 'success') {
              this.$message({
                type: 'success',
                message: '更新成功'
              });
              this.dialogFormVisible = false;
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('编辑出错！');
            this.dialogFormVisible = false;
          });
      },
      async _deleteUsers(operator, ids) {
        deleteUsers(operator, ids)
          .then(async res => {
            if (res.msg === 'success') {
              const { finishedIds, errIds, unfinishedIds } = res;
              await this.$message({
                type: 'success',
                message: res.data
              });
              await this.$message({
                type: 'success',
                message: `成功删除${finishedIds.length}个`
              });
              for (let i of finishedIds) {
                this.users.splice(
                  this.users.findIndex(user => user.id === i),
                  1
                );
              }
              if (errIds.length > 0) await this.$message.error(`失败${errIds.length}个，id:${errIds.length}`);
              if (unfinishedIds.length) await this.$message.error(`无权限${unfinishedIds.length}个，id:${unfinishedIds}`);
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('批量删除出错！');
          });
      }
    },
    computed: {
      isSuperAdmin() {
        return this.role === 'superAdmin' || this.role === 'test';
      },
      isAdmin() {
        return this.role === 'superAdmin' || this.role === 'test' || this.role === 'admin';
      },
      roles() {
        let ret = [];
        let roles = new Set();
        for (let user of this.users) {
          roles.add(user.role);
        }
        for (let role of roles) {
          ret.push({ text: role, value: role });
        }
        return ret;
      }
    },
    created: function() {
      this._getUsers(this.userName);
    }
  };
</script>

<style scoped>
  .main {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
</style>
