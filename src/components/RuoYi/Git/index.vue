<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYiGit',
  props:{
    url: {
      type: String,
      default: '',
      require: true,
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
