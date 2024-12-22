<template>
  <el-card shadow="hover">
    <el-menu
      :default-active="currentCategory"
      class="el-menu-vertical"
      active-text-color ="#E6A23C"
      @select="onSelect">
      <el-menu-item v-for="item in category" :key="item.code" :index="item.code">
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-card>
</template>

<script>
export default {
  name: 'Person',
  props: {
    currentCategory: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      category: [
        {
          code: '',
          title: '全部'
        },
        {
          code: '长三角城市群',
          title: '长三角城市群'
        },
        {
          code: '成渝城市群',
          title: '成渝城市群'
        },
        {
          code: '京津冀城市群',
          title: '京津冀城市群'
        },
        {
          code: '哈长城市群',
          title: '哈长城市群'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    onSelect(index) {
      console.log('选中分类：', index)
      this.$emit('onUpdateCategory', index)
    }
  }
}
</script>

<style scoped>
  .card-title{
    font-size: 16px;
    font-weight: bold;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  ::v-deep .el-menu {
    border-right: 0;
  }
</style>
