<template>
  <div class="main">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item v-for="(item, i) in titles" :key="name + i" @click="getVideoList(name, item)" :index="item">
        {{ item }}
      </el-menu-item>
    </el-menu>
    <div class="prews">
      <div class="item" v-for="item in curPageData" :key="item.vod_pic" @click="showVideo(item.vod_id)">
        <div class="img-box">
          <!-- <img  alt="" /> -->
          <el-image :src="item.vod_pic" style="width: 150px; height: 100px;margin:10px 10px 0px 10px" fit="cover">
            <div slot="placeholder" class="image-slot"><i class="el-icon-loading"></i></div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
        <div style="overflow:hidden;width: 150px;text-overflow: ellipsis;white-space: nowrap;">{{ item.vod_name }}</div>
      </div>
    </div>
    <div class="block">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="32"
        layout="total, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
    <a href=""></a>
  </div>
</template>

<script>
  const { getGhsConfig, checkVideoList, getVidoUrl } = require('@/request');
  const { getStorage } = require('../../common');
  const axios = require('axios');
  export default {
    name: 'ghs',
    data() {
      return {
        activeIndex: '1',
        titles: [],
        name: '',
        userName: getStorage('userName'),
        preview: [],
        curPageData: [],
        currentPage1: 1
      };
    },
    methods: {
      getVideoList(name, type) {
        this._getVideoList(name, type, this.userName);
      },
      changeData(data) {
        this.titles = data.types;
        this.name = data.name;
        // this._getVideoList(data.name, data.types[0], this.userName);
      },
      load() {
        this.loading = true;
        setTimeout(() => {
          this.count += 2;
          this.loading = false;
        }, 2000);
      },
      handleCurrentChange(val) {
        const start = (val - 1) * 32;
        const end = val * 32;
        if (end > this.total) {
          this.curPageData = this.preview.slice(start);
        } else {
          this.curPageData = this.preview.slice(start, end);
        }
      },
      showVideo(id) {
        this._getVidoUrl(id, this.name, this.userName);
      },
      //网络请求相关
      _getVideoList(name, type, userName) {
        checkVideoList(name, type, userName)
          .then(res => {
            if (res.msg === 'success') {
              this.$message({
                type: 'success',
                message: res.data
              });
            }
            this.preview = res.videos;
          })
          .catch(err => {
            console.log(err);
          });
      },
      _getVidoUrl(id, name, userName) {
        getVidoUrl(id, name, userName)
          .then(res => {
            if (res.msg === 'success') {
              this.$message({
                type: 'success',
                message: res.data
              });
            }
            this.$alert(`<a href="${res.infos['player_list'][0].url}" target="_blank">链接</a>${res.infos['player_list'][0].url}`, '视频链接', {
              dangerouslyUseHTMLString: true
            });
            // this.$alert(`复制到QQ或浏览器打开${}`, '视频链接', {
            //   confirmButtonText: '确定'
            // });
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    computed: {
      total() {
        return this.preview.length;
      }
    },
    mounted() {
      this.$bus.$on('ghsChange', data => {
        this.changeData(data);
      });
    }
  };
</script>

<style scoped>
  ul li {
    list-style: none;
  }
  .infinite-list {
    height: 50vh;
  }
  .prews {
    /* height: 70vh; */
    display: flex;
    flex-wrap: wrap;
  }
  .item {
    height: 120px;
    margin: 10px 5px 10px 0px;
  }
  /* .img-box {
    overflow: hidden;
    height: 200px;
    width: 150px;
  } */
  .block {
    margin-top: 30px;
  }
  .search {
    display: flex;
    width: 30%;
  }
</style>
