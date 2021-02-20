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
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

const { getStorage } = require('./common');

//设置axios请求自动携带token
axios.interceptors.request.use(
  config => {
    const token = getStorage('token');
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  err => Promise.reject(err)
);

//事件总线
Vue.prototype.$bus = new Vue();

VueMarkdownEditor.use(vuepressTheme);
Vue.use(VueMarkdownEditor);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
