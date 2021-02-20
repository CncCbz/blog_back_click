import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //文章草稿
    draft: {
      title: '',
      tags: [],
      prevText: '',
      article: ''
    }
  },
  mutations: {
    setDraft(state, data) {
      state.draft[data.key] = data.value;
    },
    clearDraft(state) {
      state.draft = {
        title: '',
        tags: [],
        prevText: '',
        article: ''
      };
    }
  },
  getters: {
    getDraft: state => key => state.draft[key]
  }
});
