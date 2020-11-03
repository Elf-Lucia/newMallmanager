import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MyServerHttp from './plugin/http.js'
import './assets/css/reset.css'
import moment from 'moment'
import myBread from "./components/cuscom//bread.vue";

Vue.use(ElementUI);

Vue.use(MyServerHttp)

Vue.component('myBread',myBread)

Vue.config.productionTip = false

// 全局过滤器--处理日期格式
Vue.filter('frmdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
