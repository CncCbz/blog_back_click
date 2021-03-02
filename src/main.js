import Vue from 'vue';
//axios
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
//element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//markdown编辑器
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

//事件总线
Vue.prototype.$bus = new Vue();

// Vue.use(VueMarkdownEditor);
Vue.use(mavonEditor);
Vue.use(ElementUI);
Vue.config.productionTip = false;

//在vue中对click添加防抖处理
const on = Vue.prototype.$on;
// 防抖处理
Vue.prototype.$on = function(event, func) {
  let timer;
  let debounce = func;
  if (event === 'click') {
    debounce = function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        func.apply(this, arguments);
      }, 500);
    };
  }
  on.call(this, event, debounce);
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
