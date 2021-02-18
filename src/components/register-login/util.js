const { checkPassword, checkUserName } = require('../../lib/validator/index');

const check = (userName, password) => {
  const { correct: user_name_cor, message: user_name_msg } = checkUserName(userName);

  const { correct: password_cor, message: password_msg } = checkPassword(password);

  return {
    user_name_cor,
    password_cor,
    user_name_msg,
    password_msg
  };
};

module.exports = {
  check
};
