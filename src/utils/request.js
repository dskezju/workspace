import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: 'http://127.0.0.1:5001',
  timeout: 5000,
})

export default function request(config){
  return new Promise((resolve, reject) => {
    service(config)
      .then(res => { //请求成功
        resolve(res) //进入外面调用者的.then
      })
      .catch(err => { //请求失败
        reject(err) //进入外面调用者的.catch
      })
  })
}
