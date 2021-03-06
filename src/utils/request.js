import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { getToken } from './auth'
import store from '@/store'

const errorCode = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  'default': '系统未知错误，请反馈给管理员'
}

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: 'http://127.0.0.1:5001',
  timeout: 5000,
})

service.interceptors.request.use(config => { //发送前拦截config
  // const isToken = (config.headers || {}).isToken === false
  // if(getToken() && !isToken){ //如果需要token
  //   config.headers['Authorization'] = getToken() //在字段里带上token
  // }
  // get请求映射params参数
  //就是把params里的键值对变成key=value，如果key本身是对象就迭代一层
  //有这个必要？
  // if (config.method === 'get' && config.params) {
  //   let url = config.url + '?';
  //   for (const propName of Object.keys(config.params)) {
  //     const value = config.params[propName];
  //     var part = encodeURIComponent(propName) + "=";
  //     if (value !== null && typeof(value) !== "undefined") {
  //       if (typeof value === 'object') {
  //         for (const key of Object.keys(value)) {
  //           let params = propName + '[' + key + ']';
  //           var subPart = encodeURIComponent(params) + "=";
  //           url += subPart + encodeURIComponent(value[key]) + "&";
  //         }
  //       } else {
  //         url += part + encodeURIComponent(value) + "&";
  //       }
  //     }
  //   }
  //   url = url.slice(0, -1);
  //   config.params = {};
  //   config.url = url;
  if (store.state.token) { //如果有token就放在头部
    config.headers['Oauth-Token'] = getToken()
  }
  return config
}, err => {
  console.log(err)
  Promise.reject(err) //失败了就进入外层的catch
})

service.interceptors.response.use(res => { //拦截response
    const code = res.data.code || 200
    const msg = errorCode[code] || res.data.msg || errorCode['default']

    //全局统一处理 Session超时
    if (res.headers['session_time_out'] == 'timeout') {
      Message.error('登录超时')
    }
    console.log('code:', code)

    //200 为成功状态
    if (res.code !== 200) {

      //90001 Session超时
      if (res.code === 90001) {
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录', //点击这个后进入then
            cancelButtonText: '取消', //点击这个进入catch
            type: 'warning'
          }
        ).then(() => {
            store.dispatch('LogOut').then(() => {
            location.href = '/index';
          })
        }).catch(err => {console.log(err)})
      }

      //20001 用户未登录
      if (res.code === 20001) {
        console.info("用户未登录")

        Message({
          type: 'warning',
          showClose: true,
          message: '未登录或登录超时，请重新登录哦'
        })

        return Promise.reject('error');
      }

      //70001 权限认证错误
      if (res.code === 70001) {
        console.info("权限认证错误")
        Message({
          type: 'warning',
          showClose: true,
          message: '你没有权限访问哦'
        })
        return Promise.reject('error');
      }

      return Promise.reject(res.msg);
    }
    return res.data //返回服务器返回的数据
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

// export function request(config){
//   return new Promise((resolve, reject) => {
//     service(config)
//       .then(res => { //请求成功
//         resolve(res) //进入外面调用者的.then
//       })
//       .catch(err => { //请求失败
//         reject(err) //进入外面调用者的.catch
//       })
//   })
// }
