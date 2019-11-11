// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Mint from 'mint-ui'
import { Toast,MessageBox } from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from 'axios';
import $ from './util.js';
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false;
Vue.$messageBox = Vue.prototype.$messageBox = MessageBox;
Vue.prototype.$axios = axios;
Vue.prototype.$ = $;
import qs from 'qs';
Vue.prototype.qs = qs.stringify;

Vue.use(Mint)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
