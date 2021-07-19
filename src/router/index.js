import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
//由于生产侧边栏的方法，是将下面每一块作为一个导航选项（hidden为false且有meta才会显示）
//如果不作处理的话，/路由也会变成一个导航条下面跟着子路由
//并且/路由还没有meta，那到时候它连title和icon都没有，就很诡异
//所以需要在permission.js里处理下面的路由成/index, /wiki, /user-space这样子
//其它不需要Layout包裹的路由还可以单独提出来，它们也会被处理成导航选项
export const constantRoutes = [
  {
    path: '/login',
    hidden: true, //hidden用来控制侧边栏要不要显示，hidden为false且有meta就会显示在侧边栏
    // meta: {title:'login', icon:'user'},
    component: () => import('@/views/login')
  },
  {
    path: '/401',
    hidden: true,
    component: () => import('@/views/error/401')
  },
  {
    path: '/404',
    hidden: true,
    component: () => import('@/views/error/404')
  },
  {
    path: '/', //没有采用各个路由都抽离出去的选项，因为它们都要被<Layout>包裹着
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '首页', //由于在面包屑里判断是不是首页路由分根据是有没有name:首页，所以不这样的话就会没有首页，面包屑里就又会加一个首页，导致key=item.path重复了
        meta: { title: '首页', icon: 'tree', noCache: true, affix: true },
      },
      {
        path: 'wiki',
        component: () => import('@/views/wiki'),
        meta: { title: 'Wiki', icon: 'education', affix: true },
      },
      {
        path: 'file-list',
        component: () => import('@/views/file-list'),
        meta: { title: '文件区', icon: 'documentation', affix: true },
      },
      {
        path: 'projects',
        component: () => import('@/views/projects'),
        meta: { title: '项目管理', icon: 'dashboard', affix: true },
      },
      {
        path: 'user-space/',
        component: () => import('@/views/user-space'),
        //如果redirect写成user-space/profile的话，在取出它的redirect然后router.push(redirect)时它会去找user-space/user-space/profile
        redirect: '/user-space/profile',
        meta: { title:'个人空间', icon: 'system' },
        children: [
          {
            path: 'profile',
            component: () => import('@/views/user-space/profile'),
            meta: { title: '个人中心', icon: 'system', affix: true },
          },
          {
            path: 'learning-space',
            component: () => import('@/views/user-space/learning-space'),
            meta: { title: '学习空间', icon: 'server', affix: true },
          }
        ]
      },
    ]
  },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes,
})

export default router
