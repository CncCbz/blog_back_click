// const axios = require('axios');
const { request } = require('./request');
const toLogin = async (userName, password) => {
  return request({
    method: 'post',
    url: '/login',
    data: {
      userName,
      password
    }
  });
  // return axios.post('/login', { userName, password });
};
module.exports = {
  toLogin
};
