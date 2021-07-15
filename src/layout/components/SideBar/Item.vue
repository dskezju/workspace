<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '',
      required: true,
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) { //<el-menu-item>里可以放图标
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) { //和一个slot为title的标题
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
