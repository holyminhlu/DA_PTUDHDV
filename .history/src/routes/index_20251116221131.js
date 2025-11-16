import Vue from 'vue';
import Router from 'vue-router';
import HomeView from '../views/HomeView.vue';
import KhuyenMai from '../views/KhuyenMai.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/khuyenmai', name: 'khuyenmai', component: KhuyenMai }
  ]
});
