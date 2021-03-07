<template>
  <div>评论回复</div>
</template>

<script>
  const { getReplys } = require('../../request');
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
        filter: {}
      };
    },
    methods: {
      _getReplys(userName, curPage, limit, sort, filter) {
        getReplys(userName, curPage, limit, sort, filter)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    created() {
      this._getReplys(this.userName, this.curPage, this.limit, this.sort);
    }
  };
</script>

<style scoped></style>
