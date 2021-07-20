<template>
  <div class="navbar">
    <!-- 点击展开/收起侧边栏 -->
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <!-- <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/> -->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- tooktip就是鼠标放上去自动出现提示 -->
        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" :url='git_url' class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" :url='doc_url' class="right-menu-item hover-effect" />
        </el-tooltip>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <!-- <size-select id="size-select" class="right-menu-item hover-effect" /> -->
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user-space/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb' //面包屑导航
// import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger' //展开/收起图标
import Screenfull from '@/components/Screenfull' //全屏按钮
// import SizeSelect from '@/components/SizeSelect' //选择
// import Search from '@/components/HeaderSearch' //搜索图标
import RuoYiGit from '@/components/RuoYi/Git' //git和doc图标
import RuoYiDoc from '@/components/RuoYi/Doc'

export default {
  name: 'NavBar',
  components: {
    Breadcrumb,
    // TopNav,
    Hamburger,
    Screenfull,
    // SizeSelect,
    // Search,
    RuoYiGit,
    RuoYiDoc
  },
  data() {
    return {
      git_url: 'https://github.com/dskezju/workspace',
      doc_url: 'http://doc.ruoyi.vip/ruoyi-vue',
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: { //是否显示设置
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    toggleSideBar() { //调用app里的函数，因为app是namespaced
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() { //声明这个函数是异步的，返回值会被包装成Promise
      //element-ui已经注册了$confirm，和messagebox.confirm是一样的，还有个$message
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => { //登出
          // location.href = '/index'; //立刻跳转
          this.$router.push({path: '/login'})
        })
      }).catch(() => {});
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
