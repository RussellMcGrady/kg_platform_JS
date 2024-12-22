<template>
  <div id="app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-container>
        <el-header width="200px" style="line-height:60px;font-weight:600;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;">
          <span>旭日模型</span>
        </el-header>
        <el-container>
          <el-main style="padding:0;">
            <el-row type="flex" style="margin-top: 20px;margin-bottom: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
              <span>基于分类的旭日模型</span>
            </el-row>
            <el-row type="flex" style="margin-top: 60px;margin-bottom: 20px;" justify="left">
              <el-col :span="4">
                <span>主结构：</span>
              </el-col>
              <el-col :span="6">
                <el-autocomplete
                  v-model="mainStrName"
                  :fetch-suggestions="querySearchMainStr"
                  placeholder="请选择主结构型号"
                  class="select-of-input"
                  @select="mainStrSelect"
                />
              </el-col>
            </el-row>
            <el-card v-loading="loading" shadow="never" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <div id="echartSunburst" style="height: 600px;">
                暂无数据~
              </div>
            </el-card>
            <!-- 主模型 -->
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
                  <el-table-column v-for="index in propNum" :key="index" :label="'主模型：' + (index).toString()" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row[index - 1] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
            </el-row>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
// import { knowledgeService, result2echartSunburst } from '@/api/resource/knowledge'
import { knowledgeService } from '@/api/resource/knowledge'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import * as d3 from 'd3' // secondary package based on el-pagination
// import * as Neo4jd3 from 'neo4jd3'
import * as echarts from 'echarts'
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
      loading: false,
      listLoading: false,
      resSun: [],
      mainStrName: '',
      configLabel: [],
      dialogTableVisible: false,
      countTable: 0,
      pageNumberDialog: 1,
      pageSizeDialog: 100,
      listTitle: '',
      tabelList: [],
      propNum: 6,
      countView: 100,
      clickName: '',
      H: {}
    }
  },
  watch: {
  },
  mounted() {
    // console.log('mainSearch > category', this.category)
    this.onSubmit()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    // 主结构文件上传
    echartInit() {
      const _this = this
      var myChart = echarts.init(document.getElementById('echartSunburst'))
      // myChart.showLoading('default', { text: '统计中，请稍候...', maskColor: '#404a59', textColor: '#fff' })
      myChart.clear()
      myChart.hideLoading()

      var option = {
        title: {
          text: '仙人掌模型',
          textStyle: {
            fontSize: 24,
            align: 'center'
          }
        },
        visualMap: {
          type: 'continuous',
          min: 0,
          max: _this.countView,
          inRange: {
            color: ['#2F93C8', '#AEC48F', '#FFDB5C', '#F98862']
          }
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        series: {
          type: 'sunburst',
          data: _this.resSun,
          // radius: [60, '90%'],
          itemStyle: {
            borderRadius: 7,
            borderWidth: 2
          },
          emphasis: {
            focus: 'ancestor'
          },
          // roam: true,
          labelLayout: {
            hideOverlap: true
          },
          animationEasing: 'linear',

          animationDuration: 550,
          animationDurationUpdate: 750,

          levels: [{
            r0: '15%',
            r: '35%',
            itemStyle: {
              borderWidth: 2
            },
            label: {
              rotate: 'tangential'
            }
          }, {
            r0: '35%',
            r: '70%',
            label: {
              align: 'right'
            }
          }, {
            r0: '70%',
            r: '72%',
            label: {
              position: 'outside',
              padding: 3,
              silent: false
            },
            itemStyle: {
              borderWidth: 3
            }
          }]
        }
      }
      myChart.setOption(option)

      myChart.on('dblclick', async function(params) {
        if (_this.mainStrName !== '') {
          _this.clickName = params.name
          _this.onSubmitInterface()
        } else {
          _this.$notify({
            message: '请选择主结构~',
            type: 'warning',
            duration: 2000
          })
        }
      }, err => {
        console.error('请求失败：', err)
        _this.loading = false
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    onSubmit() {
      const _this = this
      _this.loading = true
      knowledgeService.getAllLabel().then(res => {
        const data = res.data.data
        console.log('allLabel > onSubmit > 检索结果', data)
        var primaryModule = []
        var requiredModule = []
        var optionalModule = []
        _this.countView = 0
        data.forEach(element => {
          if (element.includes('基本')) {
            primaryModule.push(element)
          } else if (element.includes('必选')) {
            requiredModule.push(element)
          } else if (element.includes('可选')) {
            optionalModule.push(element)
          }
        })
        var labelArr = {
          primaryModule: JSON.stringify(primaryModule),
          requiredModule: JSON.stringify(requiredModule),
          optionalModule: JSON.stringify(optionalModule)
        }
        var params1 = {
          labelArr: JSON.stringify(labelArr),
          H: JSON.stringify(_this.H)
        }
        console.log('图谱请求参数：', params1)
        knowledgeService.sunburstModel(params1).then(res => {
          const data = res.data.data
          console.log('patent > onSubmit > 检索结果', data)
          _this.resSun = []
          _this.countView = data.requiredModule_all
          _this.resSun.push(
            {
              name: '基本模块',
              value: data.primaryModule_all,
              children: data.primaryModule
            },
            {
              name: '必选模块',
              value: data.requiredModule_all,
              children: data.requiredModule
            },
            {
              name: '可选模块',
              value: data.optionalModule_all,
              children: data.optionalModule
            }
          )
          _this.echartInit()
          _this.loading = false
        }, err => {
          console.error('类别请求失败：', err)
          _this.loading = false
          _this.$notify({
            message: '类别请求失败~',
            type: 'error',
            duration: 2000
          })
        })
      }, err => {
        console.error('请求失败：', err)
        _this.loading = false
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    querySearchMainStr(queryString, cb) {
      const _this = this
      var H = {
        label: '主结构',
        skip: 0,
        limit: 100
      }
      var params = {
        data: JSON.stringify(H)
      }
      knowledgeService.queryKgInterface(params).then(res => {
        var data = res.data.data
        this.configLabel = []
        data.nodes.forEach(node => {
          var labelObj = {}
          labelObj['value'] = node.properties.name
          labelObj['label'] = node.properties.name
          this.configLabel.push(labelObj)
        })
        console.log('返回的标签类型：：', this.configLabel)
        var configLabel = this.configLabel
        var results = queryString ? configLabel.filter(this.createStateFilter(queryString)) : configLabel

        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 500 * Math.random())
      }, err => {
        console.error('类别请求失败：', err)
        _this.loading = false
        _this.$notify({
          message: '类别请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    mainStrSelect(item) {
      // console.log(item)
      this.H = {
        label: '主结构',
        name: item.value
      }
      this.onSubmit()
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    onSubmitInterface() {
      const _this = this
      _this.loading = true
      _this.listLoading = true
      console.log('echart dblclick ::', _this.clickName)
      var H = {
        label: '主结构',
        name: _this.mainStrName
      }
      var T = {
        label: _this.clickName,
        skip: (Number(_this.pageNumberDialog - 1)) * _this.pageSizeDialog,
        limit: _this.pageSizeDialog
      }
      var params1 = {
        H: JSON.stringify(H),
        T: JSON.stringify(T),
        length: 10,
        option: 'list'
      }
      console.log('图谱请求参数：', params1)
      knowledgeService.shortestPath(params1).then(res => {
        const data = res.data.data
        console.log('patent > onSubmit > 检索结果', data)
        if (data.nodes.length > 0) {
          _this.dialogTableVisible = true
          for (var n in data.nodes) {
            data.nodes[n].id = data.nodes[n].identity.low
          }
          for (var r in data.relationships) {
            data.relationships[r].id = data.relationships[r].identity.low
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
        } else {
          _this.$notify({
            message: '请双击具体模块~',
            type: 'warning',
            duration: 2000
          })
        }
        // _this.tabelList = data.nodes
        _this.listLoading = false
        _this.loading = false
      }, err => {
        console.error('请求失败：', err)
        _this.listLoading = false
        _this.loading = false
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
    inputNumChange() {
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
    width: 250px;
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
