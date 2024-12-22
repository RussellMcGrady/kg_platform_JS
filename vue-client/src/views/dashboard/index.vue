<template>
  <div>
    <el-container>
      <el-header style="height: 100%;padding: 0;">
        <panel-group @handleSetLineChartData="handleSetLineChartData" />
      </el-header>
      <el-container>
        <el-main>
          <el-card>
            <span style="font-weight: bold;font-size: 16px;margin-right: 20px;">产品图谱</span>
            <el-radio-group v-model="searchRadio" size="mini">
              <el-radio label="电推剪" />
              <el-radio label="主结构" />
            </el-radio-group>
          </el-card>
          <div id="neo4jd3Id" class style="height: 600px;">
            暂无数据~
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import { knowledgeService } from '@/api/resource/knowledge'
import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'
// import * as echarts from 'echarts'
export default {
  components: {
    PanelGroup
  },
  data() {
    return {
      // 服务机构 即 代理机构
      searchRadio: '电推剪',
      label: '电推剪'
    }
  },
  watch: {
    searchRadio() {
      switch (this.searchRadio) {
        case '电推剪': { this.label = '电推剪'; this.init(); break }
        case '主结构': { this.label = '主结构'; this.init(); break }
        default: { this.label = '电推剪'; this.init(); break }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleSetLineChartData(type) {
    },
    init() {
      const H = {
        label: this.label
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
        var timer = null
        // eslint-disable-next-line new-cap
        window.neo4jd3 = new Neo4jd3.default('#neo4jd3Id', {
          minCollision: 60,
          neo4jData: window.myData,
          nodeRadius: 25,
          // onNodeMouseEnter: function(node) {
          //   console.log('dianji：', node)
          // },
          onNodeDoubleClick: function(node) {
            console.log('dianji：', node)
            clearTimeout(timer)
            const params = {
              id: node.id
            }
            _this.node = node
            knowledgeService.nodeClick(params).then(res => {
              // 为双击事件准备数据格式
              var graph = res.data.data
              console.log('点击事件patent:', res)
              for (var n in graph.nodes) {
                graph.nodes[n].id = graph.nodes[n].identity.low
              }
              for (var r in graph.relationships) {
                graph.relationships[r].id = graph.relationships[r].identity.low
              }
              var data = {}
              data['graph'] = {}
              data['graph'] = graph

              // 高亮点击的节点
              var highlight =
                [{
                  class: _this.node.labels[0],
                  property: 'name',
                  value: _this.node.properties.name
                }]
              // window.neo4jd3.resetNeoData(graph, highlight)
              // var data1 = window.neo4jd3.randomD3Data(_this.node, 5)
              // window.neo4jd3.updateWithD3Data(data1)
              window.neo4jd3.updateWithNeo4jData(data, highlight)
              // window.open(node.properties.url, '_blank');
            })
          },
          onNodeClick: async function(node) {
            // console.log('dianji：', node)
            clearTimeout(timer)
            timer = setTimeout(function() {
              if (_this.dynamicValidateForm.label) {
                _this.labelClick = node.labels[0]
                _this.listTitle = node.labels[0] + ':' + node.properties.name
                _this.clickId = node.id
                _this.onSubmit3()
              } else {
                _this.$message({
                  type: 'warning',
                  message: '请先输入配置特性~'
                })
              }
            }, 300)
            // setTimeout(() => {
            //   _this.$confirm('是否查看相关配置资源详情?', '提示', {
            //     confirmButtonText: '查看',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            //   }).then(() => {
            //     _this.onSubmit3()
            //   }).catch(() => {
            //     _this.$message({
            //       type: 'info',
            //       message: '已取消'
            //     })
            //   })
            // }, 1000 * Math.random())
          },
          onRelationshipDoubleClick: function(relationship) {
            console.log(
              'double click on relationship: ', relationship
            )
          },
          zoomFit: true
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>

