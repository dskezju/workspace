import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from '@/utils/auth'
import { Message } from 'element-ui'

//进度条
NProgress.configure({showSpinner: true})

//不需要验证的url
const whiteList = ['/login']

//每次进入一个路由时都要检查身份，是否已登录
router.beforeEach((to, from, next) => {
  console.log('in beforeEach')
  NProgress.start()
  //从cookies获取登录token，token是登录时服务器分配的
  if(getToken()){
    console.log('token:', getToken())
    //有token时不能访问login，重定向到/
    if(to.path === '/login'){
      next({path: '/'}) //有登录token，但这个token不验证？
      NProgress.done()
    }
    else{ //有token但不是去/login的
      if(store.getters.roles.length === 0){ //若没有拉取用户信息
        store.dispatch('GetInfo') //拉取用户信息
          .then(res => {
            console.log('res:', res)
            next()
          })
          .catch(err => { //出错就登出且删除cookie里的token，重定向到/
            console.log('err:', err)
            store.dispatch('FedLogOut')
              .then(() => {
                Message.error(err)
                next({path: '/'})
              })
          })
      }
      else{ //已经拉取用户信息，直接跳转
        next()
      }
    }
  }
  else{ //没有token
    console.log('no token, to:', to)
    //path是不包括参数的，fullPath包括后面的参数
    if(whiteList.indexOf(to.path) !== -1){ //但访问的url不需要验证
      next()
    }
    else{ //否则，转到登录页面，带上query: {redirect: to.fullPath}
      console.log('to:', to)
      next({path: `/login?redirect=${to.fullPath}`})
      NProgress.done()
    }
  }
})

//每条路由跳转后
router.afterEach(() => {
  console.log('in afterEach')
  NProgress.done()
})
