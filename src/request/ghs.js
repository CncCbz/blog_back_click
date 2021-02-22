const { request } = require('./request');

const getGhsConfig = async () => {
  return request({
    method: 'post',
    url: '/ghs/config'
  });
};

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
