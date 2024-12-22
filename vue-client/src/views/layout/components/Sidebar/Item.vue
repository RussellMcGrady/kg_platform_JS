<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    meta: {
      type: Object,
      default: () => {
        return {
          title: '',
          icon: ''
        }
      }
    }
  },
  render(h, context) {
    const { icon, title } = context.props.meta
    const vnodes = []

    // if (icon) {
    //   vnodes.push(<svg-icon icon-class={icon}/>)
    // }

      const elHtml  = createElement('svg-icon',{
        attrs: {
          'icon-class': icon
        }
      })
      vnodes.push(elHtml)
    if (title) {
      // vnodes.push(<span slot='title'>{(title)}</span>)
            const elHtml  = createElement('span',{
        attrs: {
          slot: title,
        }
      },title)
      vnodes.push(elHtml)
    }
    return vnodes
  }
}
</script>
