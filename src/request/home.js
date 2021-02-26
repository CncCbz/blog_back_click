const { Model } = require('echarts');
const { request } = require('./request');

const getVisitors = async () => {
  return request({
    method: 'get',
    url: '/home/visitors'
  });
};

module.exports = {
  getVisitors
};
