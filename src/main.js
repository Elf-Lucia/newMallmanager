import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MyServerHttp from './plugin/http.js'
import './assets/css/reset.css'

Vue.use(ElementUI);

Vue.use(MyServerHttp)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
