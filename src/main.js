import Vue from 'vue';
import App from './App.vue';
import router from './routes';

import './assets/styles/home.css';
import './assets/styles/about-contact.css';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
