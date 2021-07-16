<template>
  <div>
    <svg-icon icon-class="question" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYiDoc',
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
