import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../pages/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pets',
    name: 'PetBoard',
    component: () =>
      import(/* webpackChunkName: "pet-board" */ '../pages/PetBoard.vue')
  },
  {
    path: '/pets/:petID',
    name: 'PetDetail',
    component: () =>
      import(/* webpackChunkName: "pet-detail" */ '../pages/PetDetail.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
