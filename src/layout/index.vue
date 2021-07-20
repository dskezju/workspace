<template>
  <div>
    <div :class="classObj" class="app-wrapper" :style="{'--current-color': theme}">

      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <!-- 显示侧边栏 -->
      <side-bar class="sidebar-container" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }" />

      <div :class="{hasTagsView:needTagsView}" class="main-container">
        <!-- 显示导航栏 -->
        <div :class="{'fixed-header':fixedHeader}">
          <nav-bar />
        </div>
        <!-- app主体页面，其实是一个router-view -->
        <app-main />

        <!-- 在右边显示设置，用settings.showSettings来控制 -->
        <right-panel v-if="showSettings">
          <settings></settings>
        </right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, NavBar, Settings, SideBar } from './components'
import { mapState } from 'vuex'
import variables from '@/assets/styles/variables.scss'
export default {
  name: 'Layout',
  components: { //如果提示找不到组件那就是没有在index.js里export
    AppMain,
    NavBar,
    SideBar,
    RightPanel,
    Settings,
  },
  computed: {
    ...mapState({ //将$store.state里的东西搬到this里面来
      theme: state => state.settings.theme,
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() { //动态设置一些class
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables;
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
