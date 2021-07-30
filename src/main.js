import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'
import directive from './directive' //directive


import '@/assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/icons' // icon
import '@/permission'  //一定要import不然不会执行这里面的代码的
import Pagination from "@/components/Pagination";
import RightToolbar from "@/components/RightToolbar"
import Editor from '@/components/Editor'


Vue.component('Pagination', Pagination) //分页
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)

Vue.use(directive) //directive里返回的是一个install


// github@vue-markdown-editor
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// highlightjs
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, {
  Hljs: hljs,
  extend(md) {
    // md is a markdown-it instance, you can modify the configuration here, and use plugin for syntax expansion
    // md.set(option).use(plugin);
  },
});
VMdEditor.use(createKatexPlugin());
VMdEditor.use(createCopyCodePlugin());
Vue.use(VMdEditor)


//github@mavon-editor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)


//注册ElementUI插件
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})


//挂载到原型上
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
