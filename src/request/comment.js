const { request } = require('./request');
const getComments = async (userName, curPage, limit, sort = { createdAt: 'descending' }, filter = {}) => {
  return request({
    method: 'post',
    url: '/comment/list',
    data: { userName, filter, sort, curPage, limit }
  });
};
const setTopStatus = async (userName, status, id, articleId) => {
  return request({
    method: 'post',
    url: '/comment/status',
    data: { userName, status, id, articleId }
  });
};
const deleteComment = async (userName, targetName, isDeleted, id, articleId) => {
  return request({
    method: 'post',
    url: '/comment/delete',
    data: { userName, targetName, isDeleted, id, articleId }
  });
};
module.exports = {
  getComments,
  setTopStatus,
  deleteComment
};
