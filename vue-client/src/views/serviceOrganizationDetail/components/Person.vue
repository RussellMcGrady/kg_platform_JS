<template>
  <el-card shadow="hover">
    <div style="height: 80px;line-height:80px;padding:20px; display: flex;flex-direction: row;justify-content: center;align-items: center;">
      <div style="height: 40px;line-height: 40px;">
        <el-image :src="avatar+'?imageView2/1/w/80/h/80'" style="width: 40px;height: 40px;border-radius: 20px;"/>
      </div>
      <div style="margin-left: 20px;line-height: 40px;">
        <div class="text">{{ name }}</div>
      </div>
    </div>
    <div style="height:48px;padding:10px;display: flex;flex-direction: row;justify-content: center;">
      <el-button type="warning" size="mini" @click="toDemand">我的需求</el-button>
      <el-button type="warning" size="mini" @click="toResource">我的资源</el-button>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Person',
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  created() {
  },
  methods: {
    toDemand() {
      this.$goRoute({ path: '/demandManagement/demandOrder' })
    },
    toResource() {
      this.$goRoute({ path: '/resourceManagement/linkResource' })
    }
  }
}

</script>

<style scoped>
  .text {
    font-size: 14px;
  }
</style>
