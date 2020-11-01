import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/login/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name:'/',
    redirect:{
      name:'login'
    }
  },
  {
    path: '/login',
    name:'login',
    component:Login
  },
  {
    path: '/home',
    name:'home',
    component:Home
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
