<template>
  <!-- showLogo为布尔值，默认为true，即展示sidebar的logo -->
  <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
    <!-- 展示logo -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 用一个滚动条组件包裹menu -->
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <!-- 垂直导航栏 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 对sidebarRouters里的每个route应用sidebar-item -->
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path  + index"
          :item="route"
          :base-path="route.path"
        />
        <!-- app-link会变成一个router-link或者<a>，里面包裹着el-menu-item实现路由跳转 -->
        <!-- item就是封装了一下icon和title -->
        <!-- <app-link to="/">
          <el-menu-item index="1" :class="{'submenu-title-noDropdown':true}">
            <item icon="tree" title="首页" />
          </el-menu-item>
        </app-link>

        <app-link to="/wiki">
          <el-menu-item index="2" :class="{'submenu-title-noDropdown':true}">
            <item icon="education" title="Wiki" />
          </el-menu-item>
        </app-link>

        <app-link to="/file-list">
          <el-menu-item index="3" :class="{'submenu-title-noDropdown':true}">
            <item icon="documentation" title="文件区" />
          </el-menu-item>
        </app-link>

        <app-link to="/projects">
          <el-menu-item index="3" :class="{'submenu-title-noDropdown':true}">
            <item icon="dashboard" title="项目管理" />
          </el-menu-item>
        </app-link>

        <el-submenu ref="subMenu" index="4" popper-append-to-body>
          <template slot="title">
            <item icon="user" title="个人空间" />
          </template>

          <app-link to="/user-space/profile">
            <el-menu-item index="4-1" :class="{'submenu-title-noDropdown':false}">
              <item icon="system" title="个人信息" />
            </el-menu-item>
          </app-link>

          <app-link to="/user-space/learning-space">
            <el-menu-item index="4-2" :class="{'submenu-title-noDropdown':false}">
              <item icon="server" title="学习空间" />
            </el-menu-item>
          </app-link>
        </el-submenu> -->

      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'
import Item from './Item'
import AppLink from './Link'
import Logo from './Logo'

export default {
  name: 'SideBar',
  components: {
    Item,
    AppLink,
    Logo,
    SidebarItem,
  },
  computed: {
    ...mapState(['settings']), //将$store.state.settings搬到this里面来
    ...mapGetters(['sidebar', 'sidebarRouters']), //将getters里的sidebar搬到this里来，就不用this.$store.commit('sidebar')，而是this.sidebar了
    activeMenu() { //默认进入哪一个menu，每一个路由都可以在meta里设置
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path; //否则返回当前路由path
    },
    showLogo() { //是否展示sidebar logo
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() { //sidebar的状态
      return !this.sidebar.opened;
    }
  }
}
</script>
