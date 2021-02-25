const { request } = require('./request');
const getLogs = async (operator, curPage, limit) => {
  return request({
    method: 'post',
    url: '/log/list',
    data: {
      operator,
      curPage,
      limit
    }
  });
};

module.exports = {
  getLogs
};
