import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import util from './plugins/util';
import overlay from '@/components/Admin/Dialogs/Overlay.vue';
import SearchTextField from '@/components/SearchTextField.vue';
import LastUpdatedField from '@/components/LastUpdatedField.vue';

Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, '$util', { value: util });

Vue.component('overlay', overlay);
Vue.component('search-text-field', SearchTextField);
Vue.component('last-updated-field', LastUpdatedField);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
