<template>
  <div class="main-header">
    <div style="height:64px;line-height:64px;display: flex;flex-direction: row;">
      <div style="width:200px;display: flex;flex-direction: row;" @click="$goRoute({path:'/home/main'})">
        <img src="@/assets/logo.png" style="width:220px;height: 64px;">
        <!-- <div>
            <i class="el-icon-menu" @click="showSideBar"/>
          </div>
          <div style="margin-left: 16px;">{{ title }}</div>-->
      </div>

      <div style="width:400px; display: flex;flex-direction: column;margin-left: 40px;">
        <el-radio-group v-model="searchCategory" size="mini" fill="#E6A23C" text-color="#ffffff">
          <!--<el-radio-button label="all">全部</el-radio-button>-->
          <el-radio-button label="paper">文献</el-radio-button>
          <el-radio-button label="service">服务</el-radio-button>
          <el-radio-button label="expert">专家</el-radio-button>
          <el-radio-button label="firm">企业</el-radio-button>
          <el-radio-button label="organization">服务机构</el-radio-button>
        </el-radio-group>
        <el-input v-model="searchContent" placeholder="请输入内容">
          <el-button slot="append" type="warning" icon="el-icon-search" @click="onSearch">搜索</el-button>
        </el-input>
      </div>
      <div style="width:120px; display: flex;flex-direction: column;margin-left: 10px;padding-top:28px;">
        <el-button type="warning" @click="toPublishDemand">发布需求</el-button>
      </div>
      <div style="flex:1 1 auto;display: flex;flex-direction: row;justify-content: flex-end;line-height: 60px;">
        <div style="padding:0 10px">
          <el-button type="text" style="color:#444444;font-weight: 700;" @click="toBackPlatform">控制台</el-button>
        </div>
        <div style="padding:0 10px">
          <el-button type="text" style="color:#444444;font-weight: 700;" >消息</el-button>
        </div>
        <div style="display: flex;flex-direction: row;line-height: 64px;margin-left: 20px;">
          <el-dropdown trigger="click">
            <div style="color:#E6A23C">{{ wh }}</div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMainHeader',
  props: {
    category: {
      type: String,
      default: () => ''
    },
    content: {
      type: String,
      default: () => ''
    }
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      title: '工业知识图谱平台',
      wh: '',
      count: 0,
      searchResult: [],
      searchCategory: 'paper',
      searchContent: '',
      activeIndex: '1',
      drawer: false,
      isPreview: false,
      isShowExportData: false,
      isShowHtmlCode: false,
      isShowBatchDialog: false,
      isShowImportDialog: false,
      isShowremoteConfig: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar'])
  },
  watch: {
    name() {
      this.updateWh()
    }
  },
  mounted() {
    this.updateWh()
  },
  methods: {
    toBackPlatform() {
      this.$goRoute({ path: '/dashboard' })
    },
    showSideBar() {
      this.drawer = true
    },
    updateWh() {
      const dateTime = new Date().getHours()
      if (this.name) {
        if (dateTime >= 5 && dateTime <= 12) {
          this.wh = '早上好，' + this.name
        } else if (dateTime > 12 && dateTime <= 18) {
          this.wh = '下午好，' + this.name
        } else {
          this.wh = '晚上好，' + this.name
        }
      }
    },
    changeDrawer(v) {
      this.drawer = v
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    onSearch() {
      this.$goRoute({ name: 'mainSearch', query: { category: this.searchCategory, content: this.searchContent }})
    },
    toPublishDemand() {
      this.$goRoute({ name: 'publishDemand' })
    }
  }
}
</script>

<style lang="scss">
  .main-header {
    height: 104px;
    line-height: 104px;
    width: 100%;
    background-color:#ffffff;
    color:#181818;
    display: flex;
    padding:20px 60px;
    flex-direction: column;
    z-index:9999;
  }
</style>
