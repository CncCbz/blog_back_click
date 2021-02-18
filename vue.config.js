const pxtorem = require('postcss-pxtorem');

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          pxtorem({
            // pxtorem 的默认配置
            rootValue: 16,
            unitPrecision: 5,
            propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
            exclude: /node_modules/i
          })
        ]
      }
    }
  }
  // devServer: {
  //   proxy: 'http://106.55.20.150:8888/'
  // }
};
