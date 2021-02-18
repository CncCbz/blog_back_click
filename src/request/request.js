// import axios from 'axios';
const axios = require('axios');

const request = config => {
  // 1.创建axios的实例
  const instance = axios.create({
    // baseURL: 'http://47.92.149.236:8888/',
    baseURL: 'http://localhost:8888/',
    timeout: 50000
  });

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(
    config => {
      const token = window.sessionStorage.getItem('token');
      if (token) {
        config.headers.common['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    err => {
      // console.log(err);
    }
  );

  // 2.2.响应拦截
  instance.interceptors.response.use(
    res => {
      return res.data;
    },
    err => {
      console.log(err);
    }
  );

  // 3.发送真正的网络请求
  return instance(config);
};

module.exports = {
  request
};
