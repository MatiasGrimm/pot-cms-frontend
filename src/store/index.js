import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    globalAlert: null,
  },
  getters: {
    globalAlert: (state) => state.globalAlert,
  },
  mutations: {
    alert(state, alert) {
      state.globalAlert = {
        show: true,
        timeout: 8000,
        ...alert,
      };
    },
  },
  actions: {},
  modules: {
    auth,
  },
});
