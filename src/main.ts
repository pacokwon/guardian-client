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
    initializeStore(state) {
      if (localStorage.getItem('store') !== null) {
        this.replaceState(
          Object.assign(
            state,
            JSON.parse(localStorage.getItem('store') as string)
          )
        );
      }
    },
    setUserID(state, userID: string) {
      state.userID = userID;
    }
  },
  actions: {
    login({ commit }, userID: string) {
      commit('setUserID', userID);
    },
    logout({ commit }) {
      commit('setUserID', null);
    }
  }
});

store.subscribe((_, state) => {
  localStorage.setItem('store', JSON.stringify(state));
});

new Vue({
  router,
  apolloProvider,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initializeStore');
  }
}).$mount('#app');
