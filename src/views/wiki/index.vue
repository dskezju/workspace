<template>
  <div>
    This is wiki
    <Notice/>
    <editor :min-height="192" />
    <div class="components-container">
      <div class="editor-container">
        <markdown-editor
          id="contentEditor"
          ref="contentEditor"
          v-model="content"
        >
        </markdown-editor>
      </div>
    </div>
  </div>
</template>

<script>
import Notice from './notice'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'Wiki',
  components: {
    Notice,
    MarkdownEditor,
  },
  data(){
    return {
      content: '',
      html: '',
    }
  },
  methods: {
    markdown2Html() {
      import('showdown').then(showdown => {
        const converter = new showdown.Converter()
        // this.html = converter.makeHtml(this.content)
      })
    }
  }
}
</script>

<style scoped>
.components-container {
  border:2px solid red;
  border-radius: 2px;
}
</style>
