// const axios = require('axios');
const { request } = require('./request');
const getUsers = async userName => {
  return request({
    method: 'post',
    url: '/user/list',
    data: {
      userName
    }
  });
  // return axios.post('/getusers', { userName });
};
const editUser = async (operator, formData) => {
  return request({
    method: 'post',
    url: '/user/edit',
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
    url: '/user/delete',
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
    url: '/user/deletes',
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
    url: '/user/add',
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
