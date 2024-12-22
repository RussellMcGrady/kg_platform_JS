<template>
  <el-dropdown trigger="click">
    <el-image :src="avatar+'?imageView2/1/w/80/h/80'" style="width:40px;height: 40px;margin:10px 20px; border-radius: 10px;" />
    <el-dropdown-menu slot="dropdown" class="user-dropdown">
      <router-link class="inlineBlock" to="/">
        <el-dropdown-item>
          首页
        </el-dropdown-item>
      </router-link>
      <el-dropdown-item divided @click.native="logout">
        <span style="display:block;">个人中心</span>
      </el-dropdown-item>
      <el-dropdown-item divided @click.native="logout">
        <span style="display:block;">退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  computed: {
    ...mapGetters(['avatar'])
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style scoped>

</style>
