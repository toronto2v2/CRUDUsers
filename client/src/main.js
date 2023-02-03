import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router'
import router from '../router/index'

Vue.use(VueRouter)

Vue.config.productionTip = false;
// $bus global event creation
export const EventBus = new Vue();
new Vue({
  render: h => h(App),
  router
}).$mount('#app');
