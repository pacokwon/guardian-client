import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/pets/register',
    name: 'PetRegister',
    component: () =>
      import(/* webpackChunkName: "register-pet" */ '../pages/PetRegister.vue')
  },
  {
    path: '/pets/:petID',
    name: 'PetDetail',
    component: () =>
      import(/* webpackChunkName: "pet-detail" */ '../pages/PetDetail.vue')
  },
  {
    path: '/pets',
    name: 'PetBoard',
    component: () =>
      import(/* webpackChunkName: "pet-board" */ '../pages/PetBoard.vue')
  },
  {
    path: '/users/:userID',
    name: 'UserDetail',
    component: () =>
      import(/* webpackChunkName: "user-detail" */ '../pages/UserDetail.vue')
  },
  {
    path: '/',
    name: 'GuardianHome',
    component: () =>
      import(
        /* webpackChunkName: "guardian-home" */ '../pages/GuardianHome.vue'
      )
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
