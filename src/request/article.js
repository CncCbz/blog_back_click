const { request } = require('./request');
/**
 * 发布文章
 * @param {String} userName
 * @param {Object} article
 * @returns Promise
 */
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
/**
 * 删除文章
 * @param {String} operator 操作人
 * @param {Number} id 删除文章ID
 * @returns
 */
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
/**
 * 获取文章
 * @param {String} operator
 * @param {Number} id
 * @returns Promise
 */
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
/**
 * 更新文章
 * @param {String} operator
 * @param {String} article
 * @returns
 */
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
/**
 * 获取文章列表
 * @param {String} userName
 * @param {Number} curPage
 * @param {Number} limit
 * @param {Object} sort
 * @returns
 */
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
/**
 * 更新草稿
 * @param {String} userName
 * @param {Object} draft
 * @returns
 */
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
/**
 * 获取草稿
 * @param {String} userName
 * @returns
 */
const getDraft = async userName => {
  return request({
    method: 'post',
    url: '/draft/get',
    data: {
      userName
    }
  });
};
/**
 * 删除草稿
 * @param {String} userName
 * @returns
 */
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
