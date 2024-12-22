<template>
  <div id="app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-container>
        <el-header width="200px" style="line-height:60px;font-weight:600;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;">
          <span>事物特性表</span>
        </el-header>
        <el-container>
          <el-main style="padding:0;">
            <el-card shadow="hover">
              <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                <span>基于类别的特性检索</span>
              </el-row>
              <el-row type="flex" style="margin-top: 20px;" justify="center">
                <el-col :span="24">
                  <el-input v-model="property" placeholder="请输入相关特性" prefix-icon="el-icon-search" class="input-with-select">
                    <el-autocomplete
                      slot="prepend"
                      v-model="label"
                      :fetch-suggestions="querySearchLabelAsync"
                      placeholder="事物类型"
                      class="select-of-input"
                    />
                  </el-input>
                </el-col>
                <el-col :span="3" style="margin-left: 10px">
                  <el-button type="primary" icon="el-icon-search" circle @click="onSubmitEntity" />
                </el-col>
              </el-row>
              <el-row type="flex" style="margin-top: 20px;" justify="center">
                <card>
                  <div id="neo4jd3Id" v-loading="graphLoading" class style="height: 600px;width: 1000px;">
                    暂无数据~
                  </div>
                </card>
              </el-row>
              <!-- 事物特性表 -->
              <el-row type="flex" style="font-weight:600;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                <el-dialog :visible.sync="dialogTableVisible" :title="listTitle" width="90%">
                  <el-row type="flex" style="margin-bottom: 10px;" justify="center">
                    <el-col :span="12">
                      <el-pagination
                        :pager-count="9"
                        :total="countTable"
                        :page-size.sync="pageSizeDialog"
                        :page-sizes="[10, 20, 100, 1000]"
                        background
                        layout="sizes, prev, pager, next"
                        @current-change="current_changeDialogPage"
                        @size-change="size_changeDialogPage"
                      />
                    </el-col>
                    <el-col :span="4">
                      <el-input-number v-model="propNum" :min="1" :max="100" size="small" controls-position="right" @change="inputNumChange" />
                    </el-col>
                    <el-col :span="4">
                      <el-button size="small" type="success" icon="el-icon-download" plain @click="saveConfig2Exel">
                        保存
                      </el-button>
                    </el-col>
                  </el-row>
                  <!-- :default-sort = "{prop: 'labels', order: 'ascending'}" -->
                  <el-table
                    id="srpgtable"
                    ref="multipleTable"
                    v-loading="listLoading"
                    :data="tabelList"
                    :row_style="{height: '40px'}"
                    :cell-style="{height: '40px'}"
                    stripe
                    tooltip-effect="dark"
                    content="Top center"
                    placement="top"
                    max-height="1200"
                    element-loading-text="Loading"
                    border
                    height="500"
                    highlight-current-row
                  >
                    <el-table-column align="center" type="index" label="序号" width="80" />
                    <el-table-column v-for="index in propNum" :key="index" :label="'特性：' + (index).toString()" align="center">
                      <template slot-scope="scope">
                        <span>{{ scope.row[index - 1] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-dialog>
              </el-row>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
// import { knowledgeService, result2echartTree } from '@/api/resource/knowledge'
import { knowledgeService } from '@/api/resource/knowledge'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from 'neo4jd3'
// import * as echarts from 'echarts'
// import 'echarts-wordcloud'
// import embed from 'vega-embed'

// 引入导出Excel表格依赖
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'App',
  // components: {
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
      // detailData: this.$route.query.detail,
      graphLoading: false,
      propNum: 6,
      property: '',
      label: '',
      configLabel: [],
      dialogTableVisible: false,
      listLoading: false,
      countTable: 0,
      pageNumberDialog: 1,
      pageSizeDialog: 100,
      listTitle: '',
      tabelList: []
    }
  },
  watch: {
    searchRadio() {
      switch (this.searchRadio) {
        case 'product': { this.dynamicValidateForm.label = '整机'; this.configAttr = this.loadAttr('product'); break }
        case 'mainStructure': { this.dynamicValidateForm.label = '主结构'; this.configAttr = this.loadAttr('mainStructure'); break }
        case 'rule': { break }
        default: { this.configAttr = this.loadAttr('product'); break }
      }
    }
  },
  mounted() {
    // console.log('mainSearch > category', this.category)
    this.init()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    // 主结构文件上传
    init() {
      const H = {
        label: '整机'
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
              if (_this.label) {
                _this.listTitle = _this.label
                _this.onSubmitInterface()
              } else {
                _this.$message({
                  type: 'warning',
                  message: '请先输入事物特性~'
                })
              }
            }, 300)
          },
          onRelationshipDoubleClick: function(relationship) {
            console.log(
              'double click on relationship: ' + JSON.stringify(relationship)
            )
          },
          zoomFit: true
        })
      })
    },
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
    onSubmitEntity() {
      const _this = this
      var H = {}
      H['label'] = _this.label
      H['name'] = _this.property
      H['skip'] = 0
      H['limit'] = 60
      var params1 = {
        data: JSON.stringify(H)
      }
      console.log('图谱请求参数：', params1)
      knowledgeService.queryEntity(params1).then(res => {
        const data = res.data.data
        console.log('patent > onSubmit > 检索结果', data)
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id = data.relationships[r].identity.low
        }
        console.log('datadata', data)
        // 图谱需求submit
        // 高亮点击的节点
        var highlight =
          [{
            class: _this.label
          }]
          // 图谱需求submit
        window.neo4jd3.resetNeoData(data, highlight)
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    onSubmitInterface() {
      const _this = this
      _this.dialogTableVisible = true
      _this.listLoading = true
      var H = {}
      H['label'] = _this.label
      H['name'] = _this.property
      H['skip'] = (Number(_this.pageNumberDialog - 1)) * _this.pageSizeDialog
      H['limit'] = _this.pageSizeDialog
      var params1 = {
        data: JSON.stringify(H)
      }
      console.log('图谱请求参数：', params1)
      knowledgeService.queryKgInterface(params1).then(res => {
        const data = res.data.data
        console.log('res > 检索结果', res)
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        _this.countTable = res.data.count
        _this.tabelList = []
        data.nodes.forEach(node => {
          var splitProp = []
          // console.log('splitProp:', node.properties['name'].split('-'))
          splitProp = node.properties['name'].split('-').slice(0, _this.propNum)
          var propObj = {}
          splitProp.forEach(function(prop, index) {
            propObj[index] = prop
          })
          _this.tabelList.push(propObj)
        })
        console.log('_this.tabelList:', _this.tabelList)
        // _this.tabelList = data.nodes
        _this.listLoading = false
      }, err => {
        console.error('请求失败：', err)
        _this.listLoading = false
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    size_changeDialogPage(pageSize) {
      this.pageSizeDialog = pageSize
      // this.pageNumberMap = currentPage - 1
      this.onSubmitInterface()
    },
    current_changeDialogPage(currentPage) {
      this.pageNumberDialog = currentPage
      // this.pageNumberMap = currentPage - 1
      this.onSubmitInterface()
    },
    saveConfig2Exel() {
      // this.savepagesize = 1000// 表格长度变长
      // this.pageNumberDialog = 1
      // this.$nextTick(function() {
      this.listLoading = true
      var tableSave
      var wb
      tableSave = document.querySelector('#srpgtable')
      var fix = document.querySelector('.el-table__fixed')
      if (fix) {
        wb = XLSX.utils.table_to_book(tableSave.removeChild(fix))
        tableSave.appendChild(fix)
      } else {
        wb = XLSX.utils.table_to_book(tableSave)
      }

      /* get binary string as output */
      const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        var saveName = this.listTitle + '.xlsx'
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), saveName)
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      // this.savepagesize = 10// 表格还原
      //   return wbout
      // })
    },
    inputNumChange() {
      this.onSubmitInterface()
    },

    getMaxStr(str1, str2) {
      var max = str1.length > str2.length ? str1 : str2
      var min = (max === str1 ? str2 : str1)
      for (var i = 0; i < min.length; i++) {
        for (var x = 0, y = min.length - i; y !== min.length + 1; x++, y++) {
        // y表示所取字符串的长度
          var newStr = min.substring(x, y)
          // 判断max中是否包含newStr
          if (max.indexOf(newStr) !== -1) {
            return newStr
          }
        }
      }
      return -1
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
    line-height: 10px;
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
  .rule-row {
    margin-left: 90px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  /* .el-upload-dragger{
    width: 300px;
  } */
  .divShow  {
    text-align: center;
    font-size: 30px;
    font-weight: 300;
    line-height: 40px;
  }
  .spanShow  {
    color: #409EFF;
    text-shadow:
    0px 0px 5px #E6A23C,
    0px 0px 1px orange,
    0px 0px 1px orangered,
    0px 0px 1px #F56C6C;
  }
  /* .transfer-footer {
    margin-left: 150px;
    padding: 6px 5px;
  }
  .el-transfer-panel{
    width: 250px;
  } */

</style>
