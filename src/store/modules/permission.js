import { constantRoutes as routes } from '@/router' //从router里导入静态无访问控制的路由
import { getRouters } from '@/api/login'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView';
import InnerLink from '@/layout/components/InnerLink'

//将router里的constantRoutes导入，做相应的处理，为了适应侧边栏产生的方法，将每个导航条抽出来作为单独的一块，而不是大家都在/下面
var constantRoutes = [] //import进来的变量不能作为左值，read only，所以只能新建变量
for(const route of routes){
  if(route.path != '/'){
    // constantRoutes.push(route) //push只是对对象的引用，没有创建新内存
    constantRoutes.push(JSON.parse(JSON.stringify(route))) //深拷贝对象
  }
  else{ //只要抽离/下面的路由就行了，就不会给根也设置一个导航条
    for(const child of route.children){
      constantRoutes.push(JSON.parse(JSON.stringify(child)))
    }
  }
}
// console.log(routes[2]===constantRoutes[2]) //直接push就是true

const permission = { //没有namespaced
  state: {
    routes: [], //可访问的路由
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => { //将routes拼接在constantRoutes后面作为可访问routes
      state.addRoutes = routes
      routes = constantRoutes.concat(routes) //concat也没有创建副本
      // console.log(routes[0]===constantRoutes[0]) //true
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      const index = [{
        path: 'index',
        meta: { title: '统计报表', icon: 'dashboard'}
      }]
      state.topbarRouters = routes.concat(index);
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      console.log('sidebarRoutes:', routes)
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求用户权限专属的动态路由数据，目前不知道是什么格式
        getRouters().then(res => {
          console.log('res:', res)
          //先把json数据字符串化，然后又转化为json数据，这么做可以产生res.data的副本赋给sdata和rdata
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata) //过滤异步路由，目前没有看懂
          const rewriteRoutes = filterAsyncRouter(rdata, false, true) //不知道这两个有什么区别
          console.log('sidebarRoutes:', sidebarRoutes)

          //在末尾添加 * 匹配/404，就是把所有前面找不到的路由都重定向到/404去
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', rewriteRoutes)
          //侧边栏routes就是静态路由+动态路由
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          resolve(rewriteRoutes)
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
