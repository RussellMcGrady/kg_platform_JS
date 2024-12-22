<template>
  <div>
    <template v-for="item in menu">
      <el-menu-item
        v-if="validatenull(item.children)"
        :index="item.path"
        :key="item.name"
        @click="open(item)"
      >
        <span slot="title" :alt="item.path">{{ item.name }}</span>
      </el-menu-item>
      <el-submenu
        v-else-if="!validatenull(item.children)"
        :index="item.path"
        :key="item.name"
      >
        <template slot="title">
          <span slot="title" :class="{ 'el-menu--display': first }">{{
            item.name
          }}</span>
        </template>
        <template v-for="(child, cindex) in item.children">
          <el-menu-item
            v-if="validatenull(child.children)"
            :index="child.path"
            :key="child.name"
            @click="open(child)"
          >
            <span slot="title">{{ child.name }}</span>
          </el-menu-item>
          <sidebar-item
            v-else
            :menu="[child]"
            :index="cindex"
            :key="cindex"
          />
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import { validatenull } from '@/utils/index'
export default {
  name: 'SidebarItem',
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    first: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    validatenull(val) {
      return validatenull(val)
    },
    open(item) {
      // debugger;
      const _this = this
      if (this.$route.path === item.path) {
        return
      } else {
        _this.$emit('menuNames', item.path)
        _this.$router
          .push({
            path: item.path
          })
          .catch((err) => {
            console.log('error', err)
          })
      }
    }
  }
}
</script>

<style scoped>
::v-deep.el-submenu__title {
  height: 32px;
  line-height: 32px;
}
.el-menu-item {
  margin-left: 0;
  height: 32px;
  line-height: 32px;
}
</style>
