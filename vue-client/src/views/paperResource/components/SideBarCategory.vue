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
      default: () => 'all'
    }
  },
  data() {
    return {
      category: [
        {
          code: 'all',
          title: '全部'
        },
        {
          code: 'zhuanli',
          title: '专利'
        },
        {
          code: 'qikan',
          title: '期刊'
        },
        {
          code: 'standard',
          title: '标准'
        },
        {
          code: 'huiyi',
          title: '会议'
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
