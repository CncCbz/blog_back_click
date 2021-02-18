<template>
  <div class="main">
    <el-form label-position="left" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <el-form-item label="用户名" prop="userName">
        <el-input type="text" v-model="ruleForm.userName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="ruleForm.role" placeholder="请选择" auto-complete="off">
          <el-option v-for="item in options" :key="item.role" :label="item.rolename" :value="item.role" :disabled="item.disabled"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  const { getRoles, addUser } = require('@/request');
  export default {
    name: 'userIncrease',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length < 5 || value.length > 20) {
          callback(new Error('用户名长度不正确'));
          // callback(new Error('用户名不能为空'));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 5 || value.length > 20) {
          callback(new Error('密码长度不正确'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const validateRole = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('角色不能为空'));
        } else {
          callback();
        }
      };
      return {
        userName: window.sessionStorage.getItem('userName'),
        ruleForm: {
          userName: '',
          pass: '',
          checkPass: '',
          role: ''
        },
        options: [],
        rules: {
          userName: [{ validator: validateUsername, trigger: 'blur' }],
          pass: [{ validator: validatePass, trigger: 'blur' }],
          checkPass: [{ validator: validatePass2, trigger: 'blur' }],
          role: [{ validator: validateRole, trigger: 'blur' }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // console.log(this.ruleForm);
            this._addUser(this.userName, this.ruleForm);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
      _addUser(userName, formData) {
        addUser(userName, formData)
          .then(res => {
            if (res.msg === 'success') {
              this.$message({
                type: 'success',
                message: res.data
              });
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    created: function() {
      this._getRoles(this.userName);
    }
  };
</script>

<style scoped>
  .main {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ruleForm {
    background-color: white;
    /* height: 50vh; */
    padding: 5vw;
    width: 50vw;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
  .el-form-item__content {
    margin-left: 0px;
  }
</style>
