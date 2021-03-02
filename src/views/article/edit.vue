<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="title">
          <i class="el-icon-back" @click="goBack" style="padding-right:2vw"></i>
          <span>文章标题</span>
        </div>
        <el-input type="text" placeholder="请输入内容" v-model="article.title" maxlength="80" show-word-limit :disabled="!isInPerson"> </el-input>
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-tooltip content="编辑提交内容" placement="top">
            <el-button type="warning" icon="el-icon-edit" circle @click="dialogFormVisible = true" :disabled="!isInPerson"></el-button>
          </el-tooltip>
          <el-button type="danger" round @click="submit" :disabled="!isInPerson">更新文章</el-button>
        </el-row>
        <div class="grid-content bg-purple-light"></div>
      </el-col>
    </el-row>
    <el-dialog title="提交内容" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="article">
        <el-form-item label="预览文本" :label-width="formLabelWidth">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="article.previewText"> </el-input>
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
    <div style="height:75vh">
      <mavon-editor v-model="article.text" style="height:100%" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel" />
    </div>
  </div>
</template>

<script>
  const { updateArticle, getArticle, uploadImg } = require('@/request');
  const { getStorage } = require('../../common');
  export default {
    name: 'editArticle',
    data() {
      return {
        userName: getStorage('userName'),
        role: getStorage('role'),
        article: {
          text: '',
          title: '',
          previewText: '',
          tags: []
        },
        inputVisible: false,
        inputValue: '',
        dialogFormVisible: false,
        formLabelWidth: '100px',
        changed: false,
        isInPerson: false
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
      goBack() {
        this.$router.back();
      },
      //上传图片
      $imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
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
      //发布文章
      submit() {
        this.$confirm('是否更新文章?', '提示', {
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
              this._updateArticle(this.userName, this.article);
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
      _updateArticle(userName, article) {
        updateArticle(userName, article)
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
      },
      _getArticle(operator, id) {
        getArticle(operator, id)
          .then(res => {
            if (res.msg === 'success') {
              res.articleInfo.tags = res.articleInfo.tags.split(',');
              this.article = res.articleInfo;
              this.$message.success(res.data);
              this.isInPerson = true;
            } else if (res.msg === 'none') {
              console.log(res.data);
            } else {
              this.$message.error(res.data);
              this.isInPerson = false;
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('Error');
          });
      }
    },
    computed: {
      isSuperAdmin() {
        return this.role === 'superAdmin' || this.role === 'test';
      },
      isAdmin() {
        return this.role === 'superAdmin' || this.role === 'test' || this.role === 'admin';
      }
    },
    created() {
      const id = Number.parseInt(this.$route.query.id);
      this._getArticle(this.userName, id);
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
