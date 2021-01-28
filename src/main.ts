import Vue from 'vue';
import VueApollo from 'vue-apollo';
import Vuex from 'vuex';
// eslint-disable-next-line
// @ts-ignore
import { VueMasonryPlugin } from 'vue-masonry';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { GuardianState } from '@/types';
import '@/assets/styles.scss';

import App from './App.vue';
import router from './router';
import { apolloProvider } from './graphql/apolloProvider';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueApollo);
Vue.use(Vuex);
Vue.use(VueMasonryPlugin);

const store = new Vuex.Store<GuardianState>({
  state: {
    userID: null
  },
  mutations: {
    setUserID(state, userID: string) {
      state.userID = userID;
    }
  },
  actions: {
    setUserID({ commit }, userID: string) {
      commit('setUserID', userID);
    }
  }
});

new Vue({
  router,
  apolloProvider,
  store,
  render: h => h(App)
}).$mount('#app');
