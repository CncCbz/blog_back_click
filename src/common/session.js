/**
 * 设置sessionStorage的值
 * @param {String} key
 * @param {*} value
 */
const setStorage = (key, value) => {
  window.sessionStorage.setItem(key, value);
  return key;
};

/**
 * 获取sessionStorage
 * @param {String} key
 */
const getStorage = key => {
  return window.sessionStorage.getItem(key);
};

const clearStorage = () => {
  window.sessionStorage.clear();
  return true;
};

module.exports = {
  getStorage,
  setStorage,
  clearStorage
};
