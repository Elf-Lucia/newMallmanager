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
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/users',
        name: 'users',
        component: User,
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights,
      },
      ,
      {
        path: '/roles',
        name: 'roles',
        component: Roles,
      },
    ]
  },
  { path: '*', redirect: '/users' }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//路由守卫：在路由的配置生效之前统一的判断有没有token
router.beforeEach((to, from, next) => {
  //如果要去的是登录就不验证token
  if (to.path === '/login') {
    next()
  } else {
    //在组件出现之前获取token，有就渲染组件
    const token = localStorage.getItem("token");
    // console.log(to.path);
    if (!token) {
      router.push({ name: "login" });
      return
    }
    next()
  }

})
export default router

