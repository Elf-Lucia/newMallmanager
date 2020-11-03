import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/users/user.vue'
import Rights from '@/components/rights/rights.vue'
import Roles from '@/components/rights/roles.vue'

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
      },
      {
        path: '/rights',
        name:'rights',
        component:Rights,
      },
      ,
      {
        path: '/roles',
        name:'roles',
        component:Roles,
      },
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
