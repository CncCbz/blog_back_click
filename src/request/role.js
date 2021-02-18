const { request } = require('./request');
const getRoles = async userName => {
  return request({
    method: 'post',
    url: '/getroles',
    data: {
      userName
    }
  });
};

module.exports = {
  getRoles
};
