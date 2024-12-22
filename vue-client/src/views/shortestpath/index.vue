<template>
  <div id="app" class="my-app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-main style="padding:0 20px 20px 20px;">
        <el-card shadow="never">
          <el-header width="200px">
            <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
              <span>最短路径查询</span>
            </el-row>
          </el-header>
          <!-- <all-comment :detail-data="detailData" class="module"/>
          <my-comment :detail-data="detailData" class="module"/>
          <paper-recommend class="module"/> -->
          <el-row style="margin-left: 60px; margin-top: 10px; margin-bottom: 10px">
            <span>起始资源</span>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-left: 60px">
              <!-- <el-cascader
                v-model="HreknTypeLabel"
                :options="HknTypeLabel"
                placeholder="起始资源类型"
                clearable
                filterable
                remote
                @change="onChange('HL', HreknTypeLabel)"
              /> -->
              <el-input v-model="contentH" placeholder="请输入内容" prefix-icon="el-icon-search" class="input-with-select">
                <el-autocomplete
                  slot="prepend"
                  v-model="labelH"
                  :fetch-suggestions="querySearchLabelAsync"
                  placeholder="产品类型"
                  class="select-of-input"
                />
              </el-input>
            </el-col>
            <!-- <el-col :span="3">
              <el-cascader
                v-model="HreknType"
                :options="HknType"
                placeholder="起始资源属性"
                clearable
                filterable
                remote
                @change="onChange('H', HreknType)"
              />
            </el-col> -->
            <!-- <el-col :span="8" style="margin-left: 40px">
              <el-input v-model="Hcontent" placeholder="请输入起始资源"/>
            </el-col> -->
          </el-row>
          <el-row style="margin-left: 60px; margin-top: 10px; margin-bottom: 10px">
            <span>目标资源</span>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-left: 60px">
              <!-- <el-cascader
                v-model="TreknTypeLabel"
                :options="TknTypeLabel"
                placeholder="目标资源类型"
                clearable
                filterable
                remote
                @change="onChange('TL', TreknTypeLabel)"
              /> -->
              <el-input v-model="contentT" placeholder="请输入内容" prefix-icon="el-icon-search" class="input-with-select">
                <el-autocomplete
                  slot="prepend"
                  v-model="labelT"
                  :fetch-suggestions="querySearchLabelAsync"
                  placeholder="产品类型"
                  class="select-of-input"
                />
              </el-input>
            </el-col>
            <!-- <el-col :span="3">
              <el-cascader
                v-model="TreknType"
                :options="TknType"
                placeholder="目标资源属性"
                clearable
                filterable
                remote
                @change="onChange('T', TreknType)"
              />
            </el-col> -->
            <!-- <el-col :span="8" style="margin-left: 40px">
              <el-input v-model="Tcontent" placeholder="请输入目标资源"/>
            </el-col> -->
            <el-col :span="6" style="margin-left: 40px">
              <el-input-number v-model="pathLength" size="mini" label="关联数量" style="margin-left: 40px" @change="handleChange" />
              <el-button type="warning" icon="el-icon-search" @click="onSubmit2">
                搜索
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-card v-show="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <div id="neo4jd3Id" class style="height: 600px;">
                暂无数据~
              </div>
            </el-card>
          </el-row>
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
      detailData: this.$route.query.detail,
      reknType: 'researchField',
      knType: [{
        value: 'researchField',
        label: '姓名'
      }],
      hlabel: '专利',
      graphDis: true,
      loading: false,
      content: '',
      pathLength: 3,
      contentH: '',
      labelH: '',
      contentT: '',
      labelT: '',
      // 头、尾结点label
      // HreknTypeLabel: '',
      // HknTypeLabel: [{
      //   value: '专利',
      //   label: '专利'
      // }, {
      //   value: '期刊',
      //   label: '期刊'
      // }, {
      //   value: '作者',
      //   label: '作者'
      // }],
      // TreknTypeLabel: '',
      // TknTypeLabel: [{
      //   value: '专利',
      //   label: '专利'
      // }, {
      //   value: '期刊',
      //   label: '期刊'
      // }, {
      //   value: '作者',
      //   label: '作者'
      // }],
      // 头、尾结点property
      // HreknType: '',
      // HknType: [{
      //   value: 'name',
      //   label: 'name'
      // }, {
      //   value: 'id',
      //   label: 'id'
      // }],
      // TreknType: '',
      // TknType: [{
      //   value: 'name',
      //   label: 'name'
      // }, {
      //   value: 'id',
      //   label: 'id'
      // }],
      // H/T input
      Hcontent: '',
      Tcontent: ''
    }
  },
  watch: {
  },
  mounted() {
    console.log('mainSearch > category', this.category)
    this.init()
    // this.onSubmit2()
    // this.getExpert()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    querySearchLabelAsync(queryString, cb) {
      const _this = this
      knowledgeService.getAllLabel().then(res => {
        var data = res.data.data
        if (res.data.errcode === 20000) {
          this.configLabel = []
          data.forEach(label => {
            var labelObj = {}
            labelObj['value'] = label
            labelObj['label'] = label
            this.configLabel.push(labelObj)
          })
          console.log('返回的标签类型：：', this.configLabel)
          var configLabel = this.configLabel
          var results = queryString ? configLabel.filter(this.createStateFilter(queryString)) : configLabel

          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 500 * Math.random())
        } else {
          _this.$notify({
            message: '查询失败，请检查后台数据库',
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // onChange(item, value) {
    //   switch (item) {
    //     case 'HL': { this.HreknTypeLabel = value; break }
    //     case 'H': { this.HreknType = value; break }
    //     case 'TL': { this.TreknTypeLabel = value; break }
    //     case 'T': { this.TreknType = value; break }
    //     default: { alert('请选择~'); break }
    //   }
    // },
    async onSubmit2() {
      // 专利图谱
      const _this = this
      this.loading = true
      // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
      // const label = this.getSearchGraphTypeParam()
      // console.log(this.reknType2)
      var H = {
        label: this.labelH
      }
      H.name = this.contentH
      H['name'] = this.contentH
      var T = {
        label: this.labelT,
        skip: 0,
        limit: 50
      }
      T.name = this.contentT
      T['name'] = this.contentT

      var length = this.pathLength
      var option = 'graph'
      // H[this.reknType] = this.content
      // 用于可视化图谱
      var params1 = {
        H: JSON.stringify(H),
        T: JSON.stringify(T),
        length: length,
        option: option
      }
      console.log('图谱请求参数：', params1)
      await knowledgeService.shortestPath(params1).then(res => {
        const data = res.data.data
        console.log('patent > onSubmit > 检索结果', data)
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id = data.relationships[r].identity.low
        }
        console.log('datadata', data)
        window.echartData = data
        // 图谱需求submit
        window.neo4jd3.resetWithNeo4jData(data)
        this.loading = false
      }, err => {
        console.error('请求失败：', err)
        this.loading = false
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    handleChange(value) {
      console.log('changeValue::', value)
    },
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
        var timer = null
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
<style>
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
  .select-of-input {
    background-color: #fff;
    width: 150px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
    padding:0 0px;
    border: 0px solid #DCDFE6;
  }

</style>
