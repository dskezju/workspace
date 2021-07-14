import Cookies from 'js-cookie'

//专门用来验证登录的token
const TokenKey = 'login-token'

export function getToken(){ //获取登录token
  // console.log('cookies:', Cookies)
  console.log('Cookies.get(TokenKey):', Cookies.get(TokenKey))
  return Cookies.get(TokenKey)
}

export function setToken(token){ //set
  return Cookies.set(TokenKey, token)
}

export function removeToken(){ //remove
  return Cookies.remove(TokenKey)
}
