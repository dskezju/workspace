import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

const Index = () => import('@/views')
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
        component: Index
      },
      {
        path: 'wiki',
        component: () => import('@/views/wiki')
      },
      {
        path: 'filelist',
        component: () => import('@/views/filelist')
      },
      {
        path: 'projects',
        component: () => import('@/views/projects')
      },
      {
        path: 'userspace',
        component: () => import('@/views/userspace'),
        redirect: 'profile',
        children: [
          {
            path: 'profile',
            component: () => import('@/views/userspace/profile')
          },
          {
            path: 'learning-space',
            component: () => import('@/views/userspace/learning-space')
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
