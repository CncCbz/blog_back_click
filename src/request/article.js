const { request } = require('./request');
const issueArticle = async (userName, article) => {
  return request({
    method: 'post',
    url: '/article/issue',
    data: {
      userName,
      article
    }
  });
};
const deleteArticle = async (operator, id) => {
  return request({
    method: 'post',
    url: '/article/delete',
    data: {
      operator,
      id
    }
  });
};
const getArticle = async (operator, id) => {
  return request({
    method: 'post',
    url: '/article/get',
    data: {
      operator,
      id
    }
  });
};
const updateArticle = async (operator, article) => {
  return request({
    method: 'post',
    url: '/article/update',
    data: {
      operator,
      article
    }
  });
};
const getArticleList = async (userName, curPage, limit, sort = { created_at: 'descending' }) => {
  return request({
    method: 'post',
    url: '/article/list',
    data: {
      userName,
      curPage,
      limit,
      sort
    }
  });
};
const updateDraft = async (userName, draft) => {
  return request({
    method: 'post',
    url: '/draft/save',
    data: {
      userName,
      draft
    }
  });
};
const getDraft = async userName => {
  return request({
    method: 'post',
    url: '/draft/get',
    data: {
      userName
    }
  });
};
const deleteDraft = async userName => {
  return request({
    method: 'post',
    url: '/draft/delete',
    data: {
      userName
    }
  });
};
module.exports = {
  issueArticle,
  getArticleList,
  deleteArticle,
  getArticle,
  updateArticle,
  updateDraft,
  getDraft,
  deleteDraft
};
