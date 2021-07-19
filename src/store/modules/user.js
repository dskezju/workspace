import { getToken, removeToken, setToken } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/login'


const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '', //在getInfo时获取，如果为空就会设置成默认的
    roles: [],
    permissions: [],
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },
  actions: {
    //第一个参数是上下文，第二个参数是payload，接收一个对象
    Login(context, loginForm){
      const username = loginForm.username.trim()
      const passwd = loginForm.passwd
      const code = loginForm.code
      const uuid = loginForm.uuid
      //返回一个Promise，外面就可以用.then和.catch
      return new Promise((resolve, reject) => {
        login(username, passwd, code, uuid).then(res => { //login成功就进入then
          setToken(res.token)
          context.commit('SET_TOKEN', res.token)
          resolve() //进入外面的then（如果有的话）
        }).catch(err => { //失败就进入catch
          reject(err) //进入外面的catch，同理
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => { //在这里返回的avatar是""的话就设置成默认的
          const user = res.user
          const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => { //如果不是自然地从getInfo到.catch，而是在.then里出现如typeError然后进来这儿的话，在之后的执行中会有奇怪的问题，如路由跳转不过去
          console.log('getInfo failed')
          reject(error)
        })
      })
    },

    LogOut({commit, state}){
      //返回一个Promise
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => { //如果logout成功了，进入then
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve() //调用resolve就是调用外层的then
        }).catch(err => { //logout失败了，进入catch
          reject(err) //调用外层的catch
        })
      })
    },

    FedLogOut({commit}){ //在拉取用户信息失败时调用
      return new Promise((resolve, reject) => {
        console.log('in fedlogout')
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}


export default user
