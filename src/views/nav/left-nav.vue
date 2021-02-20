<template>
  <div class="main">
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :router="true"
      background-color="#3f3f3f"
      text-color="#c6c6c6"
    >
      <el-menu-item index="icon" disabled style="height:10vh">
        <div class="icon">
          <img :class="{ logo: true, hidden: isCollapse }" src="@/assets/img/logo.png" alt="" />
        </div>
      </el-menu-item>
      <el-menu-item index="home" v-if="isAllow('home')">
        <i class="el-icon-house"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="article" class="menu-group" v-if="isAllow('article')">
        <template slot="title">
          <i class="el-icon-edit"></i>
          <span slot="title">文章管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="article-increase">添加文章</el-menu-item>
          <el-menu-item index="article-list">文章列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="user" v-if="isAllow('user')">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="user-increase">添加用户</el-menu-item>
          <el-menu-item index="user-list">用户列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="3" v-if="isAllow('comment')">
        <i class="el-icon-chat-line-square"></i>
        <span slot="title">留言管理</span>
      </el-menu-item>
      <el-menu-item index="4" v-if="isAllow('log')">
        <i class="el-icon-tickets"></i>
        <span slot="title">博客日志</span>
      </el-menu-item>
      <el-submenu index="ghs" class="menu-group" v-if="isAllow('ghs')">
        <template slot="title">
          <i class="el-icon-video-camera"></i>
          <span slot="title">GHS</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="'ghs' + index" v-for="(item, index) in ghsList" :key="item.name" @click="ghsChange(item.name)">{{
            item.title
          }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  const { getGhsConfig } = require('@/request');
  const { getStorage } = require('../../common');
  export default {
    name: 'leftNav',
    data() {
      return {
        isCollapse: true,
        ghsList: []
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      changeNav() {
        this.isCollapse = !this.isCollapse;
      },
      isAllow(auth) {
        const authorities = JSON.parse(getStorage('authority'));
        if (authorities[auth] === 1) return true;
        return false;
      },
      ghsChange(name) {
        const { types } = this.ghsList[this.ghsList.findIndex(item => item.name === name)];
        this.$bus.$emit('ghsChange', { name, types });
      },
      //网络请求相关
      _getGhsConfig() {
        getGhsConfig()
          .then(res => {
            this.ghsList = res.config;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    created: function() {
      this._getGhsConfig();
    }
  };
</script>

<style scoped>
  .main {
    background-color: #3f3f3f;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 220px;
    min-height: 400px;
  }
  .icon {
    height: 10vh;
    max-width: 15vw;
    text-align: center;
  }
  .logo {
    width: 100%;
    height: 100%;
  }
  .el-menu {
    border: 0px;
  }
  .el-menu-item-group /deep/ ul li {
    background-color: #4b4b4b;
  }
  .hidden {
    display: none;
  }
</style>
