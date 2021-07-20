<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false //控制图标的切换
    }
  },
  mounted() { //挂载上去时执行
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return false
      }
      screenfull.toggle() //切换全屏
    },
    change() { //更新this.isFullScreen，好切换图标
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change) //监听事件，改变的时候就调用this.change()
      }
    },
    destroy() {
      if (screenfull.isEnabled) { //取消监听事件
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
