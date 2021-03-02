/**
 * @param {Function} fn 需要防抖的函数
 * @param {Number} delay 毫秒，防抖期限值
 */
function debounce(fn, delay) {
  let timer = null; //借助闭包
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay); // 简化写法
  };
}
/**
 * @param {Function} fn 需要节流的函数
 * @param {Number} delay 毫秒，节流期限值
 */
function throttle(fn, delay) {
  let valid = true;
  return function() {
    if (!valid) {
      return false;
    }
    valid = false;
    setTimeout(() => {
      fn();
      valid = true;
    }, delay);
  };
}

module.exports = {
  debounce,
  throttle
};
