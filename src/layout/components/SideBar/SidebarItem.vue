<template>
  <!-- 设置了hidden:true的路由包括其子路由不显示 -->
  <div v-if="!item.hidden">

    <!-- 当前路由只有1个或没有child的话，如果没有设置item.alwaysShow为true，就会直接显示child而不显示它自己 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">

      <!-- hidden为true的情况下，还得有meta才会构成menu-item -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>

    </template>

    <!-- 否则作为sub-menu递归下去 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <!-- 如果parent路由没有设置meta的话，就没有title和icon -->
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 递归，更改base-path为加上当前路由 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug], //混入对象，就是把FixiOSBug这个对象搬过来，那里面的methods、computed、mounted都会变成这个组件的
  props: {
    // route object
    item: {
      type: Object,
      require: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    //判断该item是不是没有children或只有一个child，是的话就直接做成el-menu-item
    hasOneShowingChild(children = [], parent) {
      console.log('item:', parent)
      if (!children) {
        children = [];
      }
      const showingChildren = children.filter(item => { //children里忽略hidden为true的child
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath) //两个path拼起来，其实就是parent的path拼上child的path
    }
  }
}
</script>
