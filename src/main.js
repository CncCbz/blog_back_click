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
// use

//事件总线
Vue.prototype.$bus = new Vue();

// Vue.use(VueMarkdownEditor);
Vue.use(mavonEditor);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
