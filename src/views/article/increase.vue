<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="title">
          <span>文章标题</span>
        </div>
        <el-input type="text" placeholder="请输入内容" v-model="article.title" maxlength="100" show-word-limit> </el-input>
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-tooltip content="编辑提交内容" placement="top">
            <el-button type="warning" icon="el-icon-edit" circle @click="dialogFormVisible = true"></el-button>
          </el-tooltip>
          <el-tooltip content="删除草稿" placement="top">
            <el-button type="info" icon="el-icon-delete" circle @click="clearDraft"></el-button>
          </el-tooltip>
          <el-button type="danger" round @click="submit">发布文章</el-button>
        </el-row>
        <div class="grid-content bg-purple-light"></div>
      </el-col>
    </el-row>
    <el-dialog title="提交内容" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="article">
        <el-form-item label="预览文本" :label-width="formLabelWidth">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="article.prevText"> </el-input>
        </el-form-item>
        <el-form-item label="标签" :label-width="formLabelWidth">
          <el-tag :key="tag" v-for="tag in article.tags" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <mavon-editor v-model="article.text" style="height:75vh" @save="saveDraft" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel" />
  </div>
</template>

<script>
  const { issueArticle, uploadImg } = require('@/request');
  const { getStorage } = require('../../common');
  export default {
    name: 'increaseArticle',
    data() {
      return {
        userName: getStorage('userName'),
        role: getStorage('role'),
        article: {
          text: '',
          title: '',
          prevText: '',
          tags: ['Javascript']
        },
        inputVisible: false,
        inputValue: '',
        dialogFormVisible: false,
        formLabelWidth: '100px',
        changed: false
      };
    },
    methods: {
      //提交内容
      handleClose(tag) {
        this.article.tags.splice(this.article.tags.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          if (this.article.tags.indexOf(inputValue) >= 0) {
            this.$message.error(`${inputValue}标签已存在！`);
            this.inputVisible = false;
            this.inputValue = '';
          } else {
            this.article.tags.push(inputValue);
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //上传图片
      $imgAdd(pos, $file) {
        var formdata = new FormData();
        formdata.append('image', $file);
        uploadImg(formdata).then(res => {
          const url = res.data.data.url.ali;
          this.$refs.md.$img2Url(pos, url);
          this.$message.success('图片上传成功！');
        });
      },
      //删除图片
      $imgDel() {
        this.$message.success('图片已删除！');
      },
      //草稿
      saveDraft() {
        this.$store.commit('setDraft', { key: 'article', value: this.article.text });
        this.$store.commit('setDraft', { key: 'tags', value: this.article.tags });
        this.$store.commit('setDraft', { key: 'title', value: this.article.title });
        this.$store.commit('setDraft', { key: 'prevText', value: this.article.prevText });
        this.$message({
          type: 'success',
          message: '草稿已保存！'
        });
      },
      clearDraft() {
        this.$confirm('确认删除草稿?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$store.commit('clearDraft');
            this.article = {
              text: '',
              title: '',
              prevText: '',
              tags: []
            };
            this.$message({
              type: 'success',
              message: '删除草稿成功!'
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      //发布文章
      submit() {
        this.$confirm('是否发布文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (this.article.text === '') {
              this.$message.error(`内容不能为空！`);
            } else if (this.article.title === '') {
              this.$message.error(`标题不能为空！`);
            } else {
              this._issueArticle(this.userName, this.article);
              this.$store.commit('clearDraft');
              this.article = {
                text: '',
                title: '',
                prevText: '',
                tags: []
              };
              this.$router.push('/article-list');
            }
          })
          .catch(() => {
            this.$message.info('已取消发布');
          });
      },
      //网络请求相关
      _issueArticle(userName, article) {
        issueArticle(userName, article)
          .then(res => {
            if (res.mes === 'success') {
              this.$message.success(res.data);
            } else {
              this.$message.error(res.data);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('Error!');
          });
      }
    },
    mounted() {
      this.article.title = this.$store.getters.getDraft('title');
      this.article.text = this.$store.getters.getDraft('article');
      this.article.prevText = this.$store.getters.getDraft('prevText');
      this.article.tags = this.$store.getters.getDraft('tags');
    },
    beforeDestroy() {
      this.saveDraft();
    },
    computed: {
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
  /* .title-box {
    display: flex;
    width: 100%;
    margin-right: 10px;
  }*/
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: slategrey;
    font-size: 20px;
  }
  .el-input {
    width: 85%;
    margin-left: 2%;
  }
  .el-row {
    margin-bottom: 10px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-col {
    display: flex;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
