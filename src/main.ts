import Vue from 'vue';
import VueApollo from 'vue-apollo';
// eslint-disable-next-line
// @ts-ignore
import { VueMasonryPlugin } from 'vue-masonry';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import '@/assets/styles.scss';

import App from './App.vue';
import router from './router';
import { apolloProvider } from './graphql/apolloProvider';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueApollo);
Vue.use(VueMasonryPlugin);

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
