const axios = require('axios');
//采用遇见图床 homepage:https://www.hualigs.cn/
const uploadImg = async data => {
  data.append('apiType', 'ali');
  data.append('token', 'de4840ac4cfe2b93a8fea4e69114e98e');
  return axios({
    url: 'https://www.hualigs.cn/api/upload',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

module.exports = {
  uploadImg
};
