<template>
  <div ref="rightPanel" :class="{show:show}" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div class="rightPanel-items">
        <!-- 放了个slot -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils'

export default {
  name: 'RightPanel',
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 250,
      type: Number
    }
  },
  computed: {
    show: {
      get() { //show与否和settings.showSettings绑定
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    theme() {
      return this.$store.state.settings.theme
    },
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    }
  },
  mounted() { //创建的时候，先插入到body的firstchild前面，然后给window添加click事件
    this.insertToBody()
    this.addEventClick()
  },
  beforeDestroy() {
    const elx = this.$refs.rightPanel
    elx.remove()
  },
  methods: {
    addEventClick() { //给window添加click事件，点击触发closeSidebar
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      console.log('evt:', evt)
      //element.closest(selector)会去往上寻找符合selector的元素，找不到就返回null
      //由于right-panel是body的第一个child，app是body的其它孩子，如果不惦记right-panel的范围内往上找是找不到.rightPanel的
      //如果点击right-panel的范围，evt.target就是div.rightPanel
      const parent = evt.target.closest('.rightPanel')
      if (!parent) { //如果没找到，说明当前点击的对象不在<div class='rightPanel'>的范围内
        this.show = false //关闭right panel
        window.removeEventListener('click', this.closeSidebar) //给window移除事件监听
      }
    },
    insertToBody() {
      const elx = this.$refs.rightPanel
      const body = document.querySelector('body') //找到body元素
      //不这样的话就无法显示，不知道为什么
      body.insertBefore(elx, body.firstChild) //插入到最前面，变成body的第一个child
    }
  }
}
</script>

<style>
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
  background: rgba(0, 0, 0, .2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

.show {
  transition: all .3s cubic-bezier(.7, .3, .1, 1);

  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
