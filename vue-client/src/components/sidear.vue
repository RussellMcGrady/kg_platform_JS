<template>
  <div style="height: 100%">
    <el-container style="border-bottom: 1px solid #e4e7ed; height: 100%">
      <el-aside
        width="17.5%"
        style="background-color: rgb(255, 255, 255); max-width: 210px"
      >
        <el-menu
          :default-active="getValue"
          router
          unique-opened
          style="width: 100%; height: 100%; overflow: auto;"
        >
          <sidebar-item
            :menu="menu"
            first
            @menuNames="nowTagValue"
          />
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import sidebarItem from '@/components/SideBarItem'
import Menu from '@/Menu'
export default {
  name: 'NavMenu',
  components: {
    sidebarItem
  },
  data() {
    return {
      getValue: '',
      menu: [],
      data: [
        {
          name: '主页',
          path: '/home',
          // redirect:'',
          icon: 'el-icon-menu',
          component: () => import('../views/dashboard/index'),
          fPkid: '123',
          children: []
        },
        {
          name: '主结构自动生成',
          path: '/mainStructure',
          // redirect:'',
          icon: 'el-icon-menu',
          component: Menu,
          fPkid: '128',
          children: [{
            name: '主结构生成',
            icon: 'el-icon-menu',
            path: '/mainStructure/gen',
            component: () => import('../views/mainStructure/index'),
            fPkid: '129',
            children: []
          },
          {
            name: '事物特性表',
            icon: 'el-icon-menu',
            path: '/mainStructure/property',
            component: () => import('../views/mainStructure/indexProp'),
            fPkid: '124',
            children: []
          },
          {
            name: '旭日模型',
            icon: 'el-icon-menu',
            path: '/mainStructure/Sunburst',
            component: () => import('../views/mainStructure/indexSunburst'),
            fPkid: '158',
            children: []
          }
          ]
        },
        {
          name: '配置自动求解',
          path: '/productConfig',
          // redirect:'',
          icon: 'el-icon-menu',
          component: Menu,
          fPkid: '125',
          children: [{
            name: '配置设计',
            icon: 'el-icon-menu',
            path: '/productConfig/config',
            component: () => import('../views/productConfig/index'),
            fPkid: '127',
            children: []
          }
          ]
        },
        {
          name: '资源图谱',
          path: '/graphView',
          // redirect:'',
          icon: 'el-icon-menu',
          component: Menu,
          fPkid: '131',
          children: [{
            name: '知识资源',
            icon: 'el-icon-menu',
            path: '/graphView/knowledge',
            component: () => import('../views/paperResource/index'),
            fPkid: '132',
            children: []
          },
          {
            name: '专利资源',
            icon: 'el-icon-menu',
            path: '/graphView/patent',
            component: () => import('../views/patentResource/index'),
            fPkid: '133',
            children: []
          },
          {
            name: '专利代理机构',
            icon: 'el-icon-menu',
            path: '/graphView/serviceOrganization',
            component: () => import('../views/serviceOrganization/index'),
            fPkid: '134',
            children: []
          },
          {
            name: '专家资源',
            icon: 'el-icon-menu',
            path: '/graphView/expert',
            component: () => import('../views/expert/index'),
            fPkid: '135',
            children: []
          }
          ]
        },
        {
          name: '图谱应用',
          path: '/graphAPP',
          // redirect:'',
          icon: 'el-icon-menu',
          component: Menu,
          fPkid: '155',
          children: [{
            name: '最短路径',
            icon: 'el-icon-menu',
            path: '/graphAPP/shortest_path',
            component: () => import('../views/shortestpath/index'),
            fPkid: '136',
            children: []
          },
          {
            name: '自然语言处理',
            icon: 'el-icon-menu',
            path: '/graphAPP/NLP',
            component: () => import('../views/nlp/index'),
            fPkid: '137',
            children: []
          },
          {
            name: '图嵌入可视化',
            icon: 'el-icon-menu',
            path: '/graphAPP/graphEmbedding',
            component: () => import('../views/graphEmbedding/index'),
            fPkid: '139',
            children: []
          },
          {
            name: '价值链分析',
            icon: 'el-icon-menu',
            path: '/graphAPP/valueChainAnalysis',
            component: () => import('../views/valueChain/index'),
            fPkid: '140',
            children: []
          },
          {
            name: '资源包',
            icon: 'el-icon-menu',
            path: '/graphAPP/resourcePackage',
            component: () => import('../views/resourcePackage/index'),
            fPkid: '141',
            children: []
          },
          {
            name: '图谱上传',
            icon: 'el-icon-menu',
            path: '/graphAPP/upload',
            component: () => import('../views/fileuploading/index'),
            fPkid: '138',
            children: []
          },
          {
            name: '图谱作画',
            icon: 'el-icon-menu',
            path: '/graphAPP/upload_Drawing',
            component: () => import('../views/graphDrawling/index'),
            fPkid: '142',
            children: []
          }
          ]
        }
      ]
    }
  },
  computed: {},
  created() {
    // this.$store.dispatch("GetMenu").then((data) => {
    //   if (data.length === 0) return;
    //   this.menu = data;
    // });
    this.menu = this.data
  },
  methods: {
    nowTagValue(data) {
      // eslint-disable-next-line no-return-assign
      return this.getValue = data
    }
  }
}
</script>

<style>
</style>
