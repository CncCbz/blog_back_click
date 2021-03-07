const { request } = require('./request');
/**
 * 获取评论
 * @param {String} userName 操作人
 * @param {Number} curPage 当前页码
 * @param {Number} limit 每页条数
 * @param {Object} sort 排序方式
 * @param {Object} filter 过滤规则
 * @returns
 */
const getComments = async (userName, curPage, limit, sort = { createdAt: 'descending' }, filter = {}) => {
  return request({
    method: 'post',
    url: '/comment/list',
    data: { userName, filter, sort, curPage, limit }
  });
};
/**
 * 设为置顶
 * @param {String} userName 操作人
 * @param {Number} status 修改后状态码:1为置顶0为不置顶
 * @param {Number} id 评论ID
 * @param {Number} articleId 文章ID
 * @returns
 */
const setTopStatus = async (userName, status, id, articleId) => {
  return request({
    method: 'post',
    url: '/comment/status',
    data: { userName, status, id, articleId }
  });
};
/**
 *
 * @param {String} userName 操作人
 * @param {String} targetName 目标用户
 * @param {Number} isDeleted 修改后状态码:1为已删除0为未删除
 * @param {Number} id 评论ID
 * @param {Number} articleId 文章ID
 * @returns
 */
const deleteComment = async (userName, targetName, isDeleted, id, articleId) => {
  return request({
    method: 'post',
    url: '/comment/delete',
    data: { userName, targetName, isDeleted, id, articleId }
  });
};
/**
 * 获取回复
 * @param {String} userName 操作人
 * @param {Number} curPage 当前页码
 * @param {Number} limit 每页条数
 * @param {Object} sort 排序方式
 * @param {Object} filter 过滤规则
 * @returns
 */
const getReplys = async (userName, curPage, limit, sort = { createdAt: 'descending' }, filter = {}) => {
  return request({
    method: 'post',
    url: '/comment/reply/list',
    data: { userName, filter, sort, curPage, limit }
  });
};

module.exports = {
  getComments,
  setTopStatus,
  deleteComment,
  getReplys
};
