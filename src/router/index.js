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
        component: () => import('@/views/index')
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
