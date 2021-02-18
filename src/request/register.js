// const axios = require('axios');
const { request } = require('./request');
const toRegister = async (userName, password) => {
  console.log('register');
  return request({
    method: 'post',
    url: '/register',
    data: {
      userName,
      password
    }
  });
  // return axios.post('/register', { userName, password });
};

module.exports = {
  toRegister
};
