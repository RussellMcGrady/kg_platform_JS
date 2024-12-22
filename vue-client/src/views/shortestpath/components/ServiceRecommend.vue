<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span class="card-title">服务推荐</span>
      <el-button style="float: right; padding: 3px 0" type="text">
        查看更多
      </el-button>
    </div>
    <div v-for="o in 6" :key="o" class="text item">
      {{ '资源服务 ' + o }}
    </div>
  </el-card>
</template>

<script>

export default {
  name: 'Person',
  data() {
    return {
    }
  },
  computed: {
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
</style>
