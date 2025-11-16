import Vue from 'vue';
import Router from 'vue-router';
import HomeView from '../views/HomeView.vue';
import KhuyenMai from '../views/KhuyenMai.vue';
import SignUp from '../views/SignUp.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/khuyenmai', name: 'khuyenmai', component: KhuyenMai },
    { path: '/dangky', name: 'dangky', component: SignUp }

  ]
});
