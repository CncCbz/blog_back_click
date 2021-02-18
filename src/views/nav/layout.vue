<template>
  <div>
    <el-container>
      <slot name="left">侧边栏</slot>
      <el-container>
        <el-header height="10vh">
          <slot name="header">头部信息</slot>
        </el-header>
        <el-main>
          <slot name="main">主要信息</slot>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'layout',
    data() {
      return {};
    },
    components: {}
  };
</script>

<style scoped>
  .el-header {
    background-color: #3f3f3f;
    color: #fff;
    text-align: center;
    padding: 0px;
  }

  .el-aside {
    background-color: #3f3f3f;
    color: #333;
    text-align: center;
    line-height: 200px;
    height: 100vh;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    height: 90vh;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
