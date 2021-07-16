import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/401',
    component: () => import('@/views/error/401')
  },
  {
    path: '/404',
    component: () => import('@/views/error/404')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '首页', //由于在面包屑里判断是不是首页路由分根据是有没有name:首页，所以不这样的话就会没有首页，面包屑里就又会加一个首页，导致key=item.path重复了
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true },
      },
      {
        path: 'wiki',
        component: () => import('@/views/wiki')
      },
      {
        path: 'file-list',
        component: () => import('@/views/file-list')
      },
      {
        path: 'projects',
        component: () => import('@/views/projects')
      },
      {
        path: 'user-space',
        component: () => import('@/views/user-space'),
        redirect: 'profile',
        children: [
          {
            path: 'profile',
            component: () => import('@/views/user-space/profile')
          },
          {
            path: 'learning-space',
            component: () => import('@/views/user-space/learning-space')
          }
        ]
      },
    ]
  },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
