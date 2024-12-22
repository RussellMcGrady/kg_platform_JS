<template>
  <div class="sidebar-container" style="overflow-x: hidden;">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        style="border-right: solid 1px rgb(48, 65, 86);"
      >
        <sidebar-item v-for="route in routers" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem'
import Logo from './Logo'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar', 'routers'
    ]),

    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    showLogo() {
      return this.$store.getters.sidebarLogo
    }
  }
}
</script>
<style scoped>
  ::v-deep .el-menu {
    border-right: solid 1px rgb(48, 65, 86);
  }
  ::v-deep .el-scrollbar {
    height: 100%;
  }
</style>
