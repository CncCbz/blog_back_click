const { request } = require('./request');

const getGhsConfig = async () => {
  return request({
    method: 'post',
    url: '/ghsconfig'
  });
};

const checkVideoList = async (name, type, userName) => {
  const limit = 200;
  return request({
    method: 'post',
    url: '/ghsvideolist',
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
    url: '/ghsvideourl',
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
