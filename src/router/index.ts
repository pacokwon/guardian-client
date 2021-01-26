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
      import(/* webpackChunkName: "about" */ '../pages/PetBoard.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
