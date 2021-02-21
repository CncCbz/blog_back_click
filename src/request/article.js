const { request } = require('./request');
const issueArticle = async (userName, article) => {
  return request({
    method: 'post',
    url: '/issuearticle',
    data: {
      userName,
      article
    }
  });
};
const deleteArticle = async (operator, id) => {
  return request({
    method: 'post',
    url: '/deletearticle',
    data: {
      operator,
      id
    }
  });
};
const getArticle = async (operator, id) => {
  return request({
    method: 'post',
    url: '/getarticle',
    data: {
      operator,
      id
    }
  });
};
const updateArticle = async (operator, article) => {
  return request({
    method: 'post',
    url: '/updatearticle',
    data: {
      operator,
      article
    }
  });
};
const getArticleList = async (userName, curPage, limit) => {
  return request({
    method: 'post',
    url: '/getarticlelist',
    data: {
      userName,
      curPage,
      limit
    }
  });
};

module.exports = {
  issueArticle,
  getArticleList,
  deleteArticle,
  getArticle,
  updateArticle
};
