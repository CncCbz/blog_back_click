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
module.exports = {
  issueArticle
};
