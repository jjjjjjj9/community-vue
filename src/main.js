// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入状态管理
import store from './vuex/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//echarts
import * as echarts  from 'echarts'
Vue.prototype.$echarts = echarts


import axios from 'axios';
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

Vue.use(ElementUI);
// 过滤器
import * as custom from './utils/utils'

Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
