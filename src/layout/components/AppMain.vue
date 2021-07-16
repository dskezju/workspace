<template>
  <div>
    <!-- <button @click='click'>btn</button> -->
    <router-view/>
  </div>
</template>

<script>
import {MessageBox} from 'element-ui'

export default {
  name: 'AppMain',
  methods: {
    click() {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
    }
  }
}
</script>
