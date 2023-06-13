import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: "/home",
    name: "Home",
    component: Home,
    children: [
      { path: "users", component: () => import("../components/user/Users.vue") },
      { path: "roles", component: () => import("../components/power/Roles.vue") },
      { path: "rights", component: () => import("../components/power/Rights.vue") }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import("@/views/Login.vue"),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  console.log(to.path);
  if (to.path === '/login') return next()

  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
