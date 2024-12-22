<template>
  <div class="sidebar-drawer">
    <el-drawer
      ref="vdrawer"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="drawer_"
      :with-header="false"
      direction="ltr"
      size="210"
    >
      <div class="drawer_content">
        <Sidebar/>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { Sidebar } from '@/views/layout/components'
export default {
  name: 'SideBarDrawer',
  components: {
    Sidebar
  },
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
    drawer_: {
      get() {
        return this.drawer
      },
      set(v) {
        this.$emit('changeDrawer', v)
      }
    }
  },
  watch: {
  },
  created() {
    // console.log('startProcess-currentEditFlow', this.currentEditFlow)
  },
  methods: {

  }
}
</script>
<style scoped>
  ::v-deep .el-drawer__body {
    padding: 0;
    width: 210px;
    height: 100%;
    overflow: hidden;
    background-color: rgb(48, 65, 86);
  }
  ::v-deep .drawer_content{
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 60px;
  }
  ::v-deep el-scrollbar__wrap{
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .drawer_footer{
    display: flex;
  }
  .el-collapse-item__content{
    padding-bottom: 0;
    padding-top: 0;
  }
  .el-collapse-item__header {
    height: 48px;
    line-height: 48px;
    background-color: #FFF;
    color: #409EFF;
    cursor: pointer;
    border-bottom: 1px solid #EBEEF5;
    font-size: 16px;
    font-weight: bold;
  }
</style>

