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
          code: 'qikan',
          title: '期刊'
        },
        {
          code: 'chn_patent',
          title: '中文专利'
        },
        {
          code: 'en_patent',
          title: '外文专利'
        },
        {
          code: 'standard',
          title: '标准'
        },
        {
          code: 'chn_huiyi',
          title: '中文会议'
        },
        {
          code: 'en_huiyi',
          title: '外文会议'
        },
        {
          code: 'chengguo',
          title: '成果'
        },
        /* {
          code: 'fagui',
          title: '法规'
        },*/
        {
          code: 'yinwen',
          title: '引文'
        }/*,
        {
          code: 'author',
          title: '作者'
        }*/
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
