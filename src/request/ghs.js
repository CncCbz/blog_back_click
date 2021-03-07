const { request } = require('./request');
/**
 * 获取分类列表
 * @returns
 */
const getGhsConfig = async () => {
  return request({
    method: 'post',
    url: '/ghs/config'
  });
};

/**
 * 获取视频列表
 * @param {String} name 网页名称
 * @param {*} type 视频类型
 * @param {*} userName 操作人
 * @returns
 */
const checkVideoList = async (name, type, userName) => {
  const limit = 200;
  return request({
    method: 'post',
    url: '/ghs/videolist',
    data: {
      name,
      type,
      userName,
      limit
    }
  });
};
/**
 * 获取视频链接
 * @param {Number} id 视频id
 * @param {String} name 网站名称
 * @param {String} userName 操作人
 * @returns
 */
const getVidoUrl = async (id, name, userName) => {
  return request({
    method: 'post',
    url: '/ghs/videourl',
    data: {
      id,
      name,
      userName
    }
  });
};

module.exports = {
  getGhsConfig,
  checkVideoList,
  getVidoUrl
};
