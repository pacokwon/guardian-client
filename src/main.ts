import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import '@/assets/styles.scss';

import App from './App.vue';
import router from './router';
import { apolloProvider } from './graphql/apolloProvider';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueApollo);

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
