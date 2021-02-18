<template>
  <div class="main">
    <div class="left">
      <el-radio-group v-model="isCollapse">
        <el-button icon="el-icon-s-unfold" @click="changeNav" :class="{ hidden: isCollapse, collapseBtn: true }"></el-button>
        <el-button icon="el-icon-s-fold" @click="changeNav" :class="{ hidden: !isCollapse, collapseBtn: true }"></el-button>
      </el-radio-group>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, i) in breadList" :to="{ path: item.path }" :key="item.name">{{ item.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand">
        <div class="avatar-box">
          <img class="avatar el-icon-arrow-down el-icon--right" src="@/assets/img/avatar.jpg" alt="" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled>{{ role }}</el-dropdown-item>
          <el-dropdown-item disabled>{{ userName }}</el-dropdown-item>
          <el-dropdown-item command="quit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'topNav',
    data() {
      return {
        isCollapse: true,
        breadList: [], // 路由集合
        userName: window.sessionStorage.getItem('userName')
      };
    },
    methods: {
      changeNav() {
        this.isCollapse = !this.isCollapse;
        this.$emit('changeNav');
      },
      isHome(route) {
        return route.name === 'home';
      },
      getBreadcrumb() {
        let matched = this.$route.matched;
        this.breadList = matched;
      },
      handleCommand(command) {
        switch (command) {
          case 'quit':
            window.sessionStorage.clear();
            this.$router.push('/login');
            this.$message('退出登录！');
        }
      }
    },
    watch: {
      $route() {
        this.getBreadcrumb();
      }
    },
    computed: {
      role() {
        switch (window.sessionStorage.getItem('role')) {
          case 'user':
            return '用户';
          case 'admin':
            return '管理员';
          case 'test':
            return '测试用户';
          case 'superAdmin':
            return '超级管理员';
        }
      }
    },
    created() {
      this.getBreadcrumb();
    }
  };
</script>

<style scoped>
  .main {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }
  .left {
    display: flex;
    flex-direction: row;
    color: #fff;
  }
  .left > div {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
    /* flex-direction: column; */
    justify-content: center;
    color: #c6c6c6;
  }
  .avatar-box {
    width: 50px;
    height: 50px;
    border-radius: 50px;
    overflow: hidden;
    margin: 0px 10px;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
  .el-breadcrumb /deep/ .el-breadcrumb__inner {
    color: #c6c6c6;
    font-weight: normal;
    cursor: pointer;
  }
  .el-breadcrumb /deep/ .el-breadcrumb__inner:hover {
    color: #409eff;
  }
  .hidden {
    display: none;
  }
  .collapseBtn {
    border: 0px;
    padding: 10px;
    margin-left: 0px;
    background-color: #3f3f3f;
  }
  .el-dropdown {
    vertical-align: top;
  }
  .el-icon--right {
    margin-left: 0px;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
