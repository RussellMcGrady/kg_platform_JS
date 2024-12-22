<template>
  <div id="app" class="my-app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-main style="padding:0 20px 20px 20px;">
        <el-card shadow="never">
          <el-header width="200px">
            <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
              <span>资源包服务</span>
            </el-row>
          </el-header>
          <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:15px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
            <span>资源包配置与管理</span>
          </el-row>
          <el-card shadow="hover">
            <el-collapse v-model="collapseData" accordion>
              <el-collapse-item title="产品包 Product package" name="1">
                <el-descriptions :column="4" :size="size" class="margin-top" title="产品详情" border>
                  <template slot="extra">
                    <el-button type="primary" size="small">
                      操作
                    </el-button>
                  </template>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-user" />
                      用户名
                    </template>
                    kooriookami
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-mobile-phone" />
                      手机号
                    </template>
                    18100000000
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-location-outline" />
                      居住地
                    </template>
                    苏州市
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-tickets" />
                      备注
                    </template>
                    <el-tag size="small">
                      学校
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-office-building" />
                      联系地址
                    </template>
                    江苏省苏州市吴中区吴中大道 1188 号
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item title="反馈 Feedback" name="2">
                <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
              </el-collapse-item>
              <el-collapse-item title="效率 Efficiency" name="3">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
              </el-collapse-item>
              <el-collapse-item title="可控 Controllability" name="4">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-card>
      </el-main>
    </div>
  </div>
</template>

<script>
// import HeadMenu from './components/Header'
import { knowledgeService } from '@/api/resource/knowledge'
// import SearchResult from './components/SearchResult'
// import SideBarCategory from './components/SideBarCategory'
// import PaperRecommend from './components/PaperRecommend'
// import ExpertRecommend from './components/ExpertRecommend'
// import ServiceRecommend from './components/ServiceRecommend'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'

export default {
  name: 'App',
  // components: {
  //   HeadMenu,
  //   SearchResult,
  //   SideBarCategory,
  //   PaperRecommend,
  //   ExpertRecommend,
  //   ServiceRecommend,
  //   Pagination
  // },
  props: {
    currentCategory: {
      type: String,
      default: () => 'all'
    }
  },
  data() {
    return {
      collapseData: 1
    }
  },
  watch: {
    searchRadio() {
      switch (this.searchRadio) {
        case 'Words Segment': { this.result = ''; break }
        default: { this.result = ''; break }
      }
    }
  },
  mounted() {
    console.log('mainSearch > category', this.category)
    // this.init()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    init() {
      const H = {
        label: this.hlabel
      }
      const params = {
        data: JSON.stringify(H)
      }
      const _this = this
      knowledgeService.getInit(params).then(res => {
        console.log('initdata:', res)
        var data = res.data.data
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        window.Neo4jd3 = Neo4jd3
        window.d3 = d3
        console.log('格式化data:', data)
        window.myData = data
        // eslint-disable-next-line new-cap
        window.neo4jd3 = new Neo4jd3.default('#neo4jd3Id', {
          minCollision: 50,
          neo4jData: window.myData,
          nodeRadius: 25,
          // onNodeMouseEnter: function(node) {
          //   console.log('dianji：', node)
          // },
          onNodeDoubleClick: function(node) {
            console.log('dianji：', node)
            const params = {
              id: node.id
            }
            _this.node = node
            knowledgeService.nodeClick(params).then(res => {
              res = res.data.data
              console.log('点击事件patent:', res)
              for (var n in res.nodes) {
                res.nodes[n].id = res.nodes[n].identity.low
              }
              for (var r in res.relationships) {
                res.relationships[r].id = res.relationships[r].identity.low
              }
              // 高亮点击的节点
              var highlight =
                [{
                  class: _this.node.labels[0],
                  property: 'name',
                  value: _this.node.properties.name
                }]
              window.neo4jd3.resetNeoData(res, highlight)
              // window.open(node.properties.url, '_blank');
            })
          },
          onRelationshipDoubleClick: function(relationship) {
            console.log(
              'double click on relationship: ' + JSON.stringify(relationship)
            )
          },
          zoomFit: true
        })
      })
    }
  }
}
</script>

<style>
  html,body,#app{
    height: 100%;
  }
</style>
<style scoped>
  .my-app{
    background-color: rgb(238, 238, 238);
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }
  .module{
    margin-top: 10px;
  }
  .el-header {
    line-height: 60px;
  }
  .el-aside {
    color: #333;
  }
  .divShow  {
    text-align: center;
    font-size: 50px;
    font-weight: 600;
    line-height: 150px;
  }
  .spanShow  {
    color: white;
    text-shadow:
    0px 0px 20px yellow,
    0px 0px 10px orange,
    0px 0px 10px orangered,
    0px 0px 10px red;
  }
</style>
