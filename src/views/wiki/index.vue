<template>
  <div>
    <a id='a-link' :href="wiki_href" target="WikiPage">blog</a>
    <Notice/>
    <editor :min-height="192" />
    <v-md-editor
      v-model='content'
      height='300'
      ref='v_editor'
      :disabled-menus="[]"
      @upload-image="handleUploadImage"
    />
    <markdown-editor
      :editor='editor1'
      class="me-write-editor"
    />
    <div class="me-view-content">
      <markdown-editor :editor='editor2'/>
    </div>
  </div>
</template>

<script>
import Notice from './notice'
import MarkdownEditor from '@/components/MarkdownEditor'
import { getToken} from '@/utils/auth'
import getters from '@/store/getters'

export default {
  name: 'Wiki',
  components: {
    Notice,
    MarkdownEditor,
  },
  data(){
    return {
      content: '',
      editor1: {
        value: '',
        ref: '', //为了拿到editor实例
        placeholder: 'Edit here with Markdown...',
        tabSize: 4,
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },
      },
      editor2: {
        value: '',
        toolbarsFlag: false, //不显示工具栏
        subfield: false, //不分栏，只显示单栏
        defaultOpen: 'preview' //默认显示预览，这样就可以拿到内容后直接放进value里，直接用它渲染的方式只显示预览
      }
    }
  },
  mounted(){
    document.getElementById("a-link").click()
  },
  computed:{
    wiki_href(){
      let base = process.env.VUE_APP_WIKI_URL
      if(getToken()){
        return base + '/login?loginToken=' + getToken()
      }
      return base
    }
  },
  methods: {
    markdown2Html() {
      import('showdown').then(showdown => {
        const converter = new showdown.Converter()
        // this.html = converter.makeHtml(this.content)
      })
    },
    handleUploadImage(event, insertImage, files) {
      // Get the files and upload them to the file server, then insert the corresponding content into the editor
      console.log('files:', files);
      console.log('event:', event)
      console.log(insertImage)
      //mavon-editor的html渲染结果在其实例的d_render里
      console.log('md:', this.editor1.ref.d_render)
      this.editor2.value = this.editor1.value
      console.log('v-md-editor:', this.$refs.v_editor)

      // Here is just an example
      insertImage({
        url:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
        desc: 'desc',
        width: 'auto',
        height: 'auto',
      });
    },
  }
}
</script>

<style scoped>
  .me-write-editor {
    min-height: 650px !important;
  }

  .me-view-container {
    width: 700px;
  }
</style>
