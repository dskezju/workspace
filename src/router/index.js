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
        component: () => import('@/views/wiki'),
        meta: { title: 'Wiki', icon: 'dashboard', noCache: true, affix: true },
      },
      {
        path: 'file-list',
        component: () => import('@/views/file-list'),
        meta: { title: '文件区', icon: 'dashboard', noCache: true, affix: true },
      },
      {
        path: 'projects',
        component: () => import('@/views/projects'),
        meta: { title: '项目管理', icon: 'dashboard', noCache: true, affix: true },
      },
      {
        path: 'user-space/',
        component: () => import('@/views/user-space'),
        redirect: 'user-space/profile',
        children: [
          {
            path: 'profile',
            component: () => import('@/views/user-space/profile'),
            meta: { title: '个人中心', icon: 'dashboard', noCache: true, affix: true },
          },
          {
            path: 'learning-space',
            component: () => import('@/views/user-space/learning-space'),
            meta: { title: '学习空间', icon: 'dashboard', noCache: true, affix: true },
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
