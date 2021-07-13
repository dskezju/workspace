import request from '@/utils/request'

//登录
export function login(username, passwd, code, uuid){
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
  return request({
    url: '/getInfo',
    method: 'get',
  })
}

//登出，同样可以知道是谁在登出
export function logout(){
  return request({
    url: '/logout',
    method: 'post',
  })
}

//获取验证码
export function getCodeImg(){
  return request({
    url: '/captchaImage',
    method: 'get',
  })
}
