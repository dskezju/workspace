import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import settings from './modules/settings'
import permission from './modules/permission'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    app,
    user,
    settings,
    permission,

  }
})
