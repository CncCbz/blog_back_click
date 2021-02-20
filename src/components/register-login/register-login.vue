<template>
  <div class="main">
    <div class="login-box">
      <div>
        <label for="userName" class="label">用户名</label>
        <el-input v-model.trim="userName" placeholder="请输入账号" id="userName"></el-input>
        <p class="errorMsg" ref="userNameError">{{ userNameError }}</p>
      </div>
      <div>
        <label for="password" class="label">密码</label>
        <el-input placeholder="请输入密码" v-model.trim="password" show-password id="password"></el-input>
        <p class="errorMsg" ref="passwordError">{{ passwordError }}</p>
      </div>
      <div class="button">
        <el-row>
          <!-- <el-button type="info">游客登录</el-button> -->
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../../router';
  const { check } = require('./util');
  const { toRegister, toLogin } = require('../../request');
  const { setStorage } = require('../../common');
  export default {
    name: '',
    data() {
      return {
        userName: '',
        password: '',
        userNameError: 'error info',
        passwordError: 'error info'
      };
    },
    methods: {
      login() {
        toLogin(this.userName, this.password)
          .then(res => {
            if (res.msg === 'success') {
              const token = res.token;
              const role = res.role;
              const userName = res.userName;
              const authority = JSON.stringify(res.authority);
              setStorage('token', token);
              setStorage('role', role);
              setStorage('userName', userName);
              setStorage('authority', authority);
              this.successNotify(res.data);
              router.replace('/home');
            } else {
              this.failNotify(res.data);
            }
          })
          .catch(err => {
            console.log(err);
            this.failNotify('error');
          });
      },
      register() {
        const { user_name_cor, password_cor, user_name_msg, password_msg } = check(this.userName, this.password);
        if (user_name_cor && password_cor) {
          toRegister(this.userName, this.password)
            .then(res => {
              if (res.msg === 'success') this.successNotify(res.data);
              else this.failNotify(res.data);
            })
            .catch(err => {
              this.failNotify('error');
              console.log(err);
            });
        } else {
          this.failNotify(`注册失败`);
        }
        this.setUserNameTip(user_name_cor, user_name_msg);
        this.setPasswordTip(password_cor, password_msg);
      },
      successNotify(mes) {
        this.$message({
          message: mes,
          type: 'success'
        });
      },
      failNotify(mes) {
        this.$message.error(mes);
      },
      setUserNameTip(bol, msg) {
        if (bol) {
          this.userNameError = msg;
          this.$refs.userNameError.style.opacity = 0;
        } else {
          this.userNameError = msg;
          this.$refs.userNameError.style.opacity = 1;
        }
      },
      setPasswordTip(bol, msg) {
        if (bol) {
          this.passwordError = msg;
          this.$refs.passwordError.style.opacity = 0;
        } else {
          this.passwordError = msg;
          this.$refs.passwordError.style.opacity = 1;
        }
      }
    }
  };
</script>

<style scoped>
  .fl {
    display: flex;
  }
  .main {
    height: 100vh;
    width: 100vw;
    background: slateblue;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-box {
    height: 37vh;
    width: 25vw;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
  }
  .label {
    display: inline-block;
    margin: 10px 0px;
  }
  .button {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .errorMsg {
    color: red;
    opacity: 0;
    margin: 0px;
    font-size: 5px;
    text-align: center;
  }
</style>
