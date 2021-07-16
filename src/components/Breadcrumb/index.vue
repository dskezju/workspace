<template>
  <!-- seperator就是面包屑的分隔符，首页 / 个人中心 / 个人信息 -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- transition是包裹动画过渡的，用v-for渲染必须用transition-group -->
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <!-- 在route里设置redirect是不是'noRedirect'，是的话在面包屑中不可点击 -->
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <!-- 否则就跳转到重定向中 -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null //路由匹配到的父子层级关系
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() { //找到面包屑里应该显示些什么
      // only show routes with meta.title
      // matched里面包括了自己和祖先级路由，一定要有children才构成父子关系
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0] //老祖宗路由

      if (!this.isDashboard(first)) { //如果老祖宗路由不是首页的话，再加一个首页
        matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
      }
      //需要有title且不显式设置breadcrumb为false，就显示在面包屑里
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) { //看看route是不是首页
      const name = route && route.name
      if (!name) { // 必须有name且name=='首页'
        return false
      }
      return name.trim() === '首页'
    },
    handleLink(item) {
      const { redirect, path } = item //matched里的item有path属性
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
