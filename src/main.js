import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import RBtn from './components/RBtn.vue';
import vuetify from './plugins/vuetify';
import SearchTextField from '@/components/SearchTextField.vue';

Vue.config.productionTip = false;

Vue.component('r-btn', RBtn);
Vue.component('search-text-field', SearchTextField);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
