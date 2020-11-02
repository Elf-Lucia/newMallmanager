import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/users/user.vue'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/login',
    name:'login',
    component:Login
  },
  {
    path: '/',
    name:'home',
    component:Home,
    children:[
      {
        path: '/user',
        name:'user',
        component:User,
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
