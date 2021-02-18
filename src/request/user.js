// const axios = require('axios');
const { request } = require('./request');
const getUsers = async userName => {
  return request({
    method: 'post',
    url: '/getusers',
    data: {
      userName
    }
  });
  // return axios.post('/getusers', { userName });
};
const editUser = async (operator, formData) => {
  return request({
    method: 'post',
    url: '/edituser',
    data: {
      operator,
      formData
    }
  });
  // return axios.post('/edituser', { operator, formData });
};
const deleteUser = async (operator, id) => {
  return request({
    method: 'post',
    url: '/deleteuser',
    data: {
      operator,
      id
    }
  });
  // return axios.post('/deleteuser', { operator, id });
};
const deleteUsers = async (operator, ids) => {
  return request({
    method: 'post',
    url: '/deleteusers',
    data: {
      operator,
      ids
    }
  });
  // return axios.post('/deleteusers', { operator, ids });
};
const addUser = async (operator, formData) => {
  return request({
    method: 'post',
    url: '/adduser',
    data: {
      operator,
      formData
    }
  });
};
module.exports = {
  getUsers,
  editUser,
  deleteUser,
  deleteUsers,
  addUser
};
