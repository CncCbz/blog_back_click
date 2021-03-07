const { Model } = require('echarts');
const { request } = require('./request');
/**
 * 获取访客信息
 * @returns Promise
 */
const getVisitors = async () => {
  return request({
    method: 'get',
    url: '/home/visitors'
  });
};

module.exports = {
  getVisitors
};
