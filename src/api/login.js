import {request} from '@/utils/request'

//登录
export function login(username, passwd, code, uuid){
  return new Promise((resolve, reject) => {
    const res = {token: '123456'}
    resolve(res)
  })
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      passwd,
      code,
      uuid,
    }
  })
}

//获取用户信息，服务器根据传过去的cookie里的token可以判断身份
export function getInfo(){
  return new Promise((resolve, reject) => {
    const res = {user: {avatar: '', username: 'visitor'}, roles: ['auth'], permissions: ['*:*:*']}
    resolve(res)
  })
  return request({
    url: '/getInfo',
    method: 'get',
  })
}

//登出，同样可以知道是谁在登出
export function logout(){
  return new Promise((resolve, reject) => {
    const res= {
      uuid: 123,
      img: '/src/assets/logo/logo.png'
    }
    resolve(res)
  })
  return request({
    url: '/logout',
    method: 'post',
  })
}

//获取验证码
export function getCodeImg(){
  return new Promise((resolve, reject) => {
    const res= {
      uuid: 123,
      img: '/src/assets/logo/logo.png'
    }
    resolve(res)
  })

  return request({
    url: '/captchaImage',
    method: 'get',
  })
}

const routes = [

]
export function getRouters(){
  return new Promise(resolve => {
    const res = {data: routes}
    resolve(res)
  })
}
