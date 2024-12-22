<template>
  <div id="app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-container>
        <el-header width="200px" style="line-height:60px;font-weight:600;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;">
          <span>配置规则自动生成</span>
        </el-header>
        <el-container>
          <el-main style="padding:0">
            <el-card shadow="never">
              <!-- 配置规则自动生成 -->
              <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                <span>配置规则求解</span>
              </el-row>
              <div style="padding:40px;">
                <el-steps :space="200" :active="active">
                  <el-step title="规则导入" />
                  <el-step title="规则查询" />
                  <el-step title="规则自动生成" />
                </el-steps>
              </div>
              <div v-if="active === 1">
                <el-form ref="similarityInput" :model="{}" label-width="150px" label-position="top">
                  <el-form-item label="请按如下格式上传BOM数据表">
                    <el-table
                      :data="exData"
                      style="width: 100%"
                      border
                    >
                      <el-table-column
                        prop="label01"
                        label="label"
                      />
                      <el-table-column
                        prop="name01"
                        label="name"
                      />
                      <el-table-column
                        prop="ref01"
                        label="ref"
                      />
                      <el-table-column
                        prop="characteristic"
                        label="characteristic"
                      />
                      <el-table-column
                        prop="shen"
                        label="......"
                      />
                      <el-table-column
                        prop="label02"
                        label="label"
                      />
                      <el-table-column
                        prop="name02"
                        label="name"
                      />
                      <el-table-column
                        prop="rel02"
                        label="ref"
                      />
                    </el-table>
                    <el-row type="flex" style="margin-top: 20px" justify="left">
                      <el-col :span="6">
                        <el-button type="text" @click="toTemplate('dir=rule&name=规则-模板.csv')">
                          下载规则模板<i class="el-icon-view el-icon--right" />
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-form>
                <el-row style="margin-top: 40px;font-weight:600;font-size:15px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                  <span>规则文件导入</span>
                </el-row>
                <el-row type="flex" style="margin-top: 20px;" justify="center">
                  <el-col :span="8">
                    <el-upload
                      ref="uploadRule"
                      :on-change="uploadChangeRule"
                      :file-list="RuleFileList"
                      :http-request="uploadFileRule"
                      :auto-upload="false"
                      :limit="1"
                      class="upload-demo"
                      drag
                      action=""
                      multiple
                    >
                      <i class="el-icon-upload" />
                      <div class="el-upload__text">
                        将规则文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div slot="tip" class="el-upload__tip">
                        文件格式为utf-8。
                      </div>
                    </el-upload>
                  </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 20px;" justify="end">
                  <el-button :loading="loading" type="primary" icon="el-icon-upload" plain @click="ruleImport">
                    导入
                  </el-button>
                </el-row>
              </div>
              <div v-if="active === 2">
                <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                  <span>请选择需求</span>
                </el-row>
                <el-row type="flex" justify="left" style="margin-top: 40px;margin-bottom: 20px;">
                  <el-autocomplete
                    v-model="ruleGenSel"
                    :fetch-suggestions="querySearchLabelAsync"
                    placeholder="请选择"
                    class="select-of-input"
                  />
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-search" plain @click="ruleView">
                      规则
                    </el-button>
                    <el-button type="success" icon="el-icon-share" plain @click="ruleGraphView">
                      图谱
                    </el-button>
                  </el-button-group>
                </el-row>
                <el-row v-show="ruleshow===true" type="flex" justify="left" style="margin-top: 40px;">
                  <el-pagination
                    :pager-count="9"
                    :total="countList"
                    :page-size.sync="pageSizeDialog"
                    :page-sizes="[10, 20, 100, 1000]"
                    background
                    layout="sizes, prev, pager, next"
                    @current-change="current_changeDialogPage"
                    @size-change="size_changeDialogPage"
                  />
                </el-row>
                <div class="divShow">
                  <el-card v-loading="ruleloading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                    <el-card v-for="(rule, index) in rulesGeneration" v-show="ruleshow===true" :key="index" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                      IF <span class="spanShow">{{ rule.Q.split(':')[1] }}</span>
                      THEN <span class="spanShow">{{ rule.A.split(':')[1] }}</span>
                    </el-card>
                    <div v-show="ruleGraphVis===true" id="neo4jd3IdRuleGen" class style="height: 600px;">
                      暂无数据~
                    </div>
                  </el-card>
                </div>
                <el-row type="flex" justify="end" style="margin-top: 40px;">
                  <el-col :span="6">
                    <el-button-group>
                      <el-button size="medium" type="info" icon="el-icon-refresh" plain @click="active=1">
                        首页
                      </el-button>
                      <el-button size="medium" type="primary" icon="el-icon-right" plain @click="active=3">
                        下一步
                      </el-button>
                    </el-button-group>
                  </el-col>
                </el-row>
              </div>
              <div v-if="active === 3">
                <el-button :loading="ruleGenLoading" type="warning" icon="el-icon-question" plain @click="ruleComplete">
                  规则自动生成
                </el-button>
                <el-table
                  v-if="ruleGenTabel.length>0"
                  id="ruleGenTabel"
                  ref="ruleGenTabel"
                  v-loading="ruleGenLoading"
                  :data="ruleGenTabel"
                  :row_style="{height: '40px'}"
                  :cell-style="{height: '40px'}"
                  :default-sort="{prop: 'prob', order: 'descending'}"
                  stripe
                  tooltip-effect="dark"
                  content="Top center"
                  placement="top"
                  max-height="450"
                  element-loading-text="Loading"
                  height="300"
                  highlight-current-row
                  @row-dblclick="dblclickRow"
                >
                  <el-table-column align="center" type="index" label="序号" width="95" />
                  <el-table-column
                    prop="Hname"
                    label="需求"
                  />
                  <el-table-column
                    prop="Tname"
                    label="模块"
                  />
                  <el-table-column
                    prop="prob"
                    label="关联概率"
                    sortable
                  />
                  <el-table-column
                    prop="maxLength"
                    label="最大层级"
                  />
                  <el-table-column
                    :key="Math.random()"
                    width="80"
                  >
                    <template slot="header">
                      规则生成
                    </template>
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="dblclickRow(scope.row)"
                      >
                        添加
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" style="margin-top: 40px;">
                  <el-col :span="6">
                    <el-button-group>
                      <el-button size="medium" type="primary" icon="el-icon-left" plain @click="active=2">
                        上一步
                      </el-button>
                      <el-button size="medium" type="info" icon="el-icon-refresh" plain @click="active=1">
                        首页
                      </el-button>
                    </el-button-group>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { knowledgeService } from '@/api/resource/knowledge'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'
import { NEO4J_HOST } from '../../../config/config'

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
      active: 1,
      countList: 0,
      graphDis: true,
      ruleGraphDis: false,
      ruleGraphVis: false,
      loading: false,
      ruleloading: false,
      processloading: false,
      listLoading: false,
      listLoadingTrans: false,
      ProRelistLoading: false,
      searchRadio: 'product',
      processRadio: 'priority',
      showRadio: 'graph',
      params: {},
      exData: [{
        label01: '需求',
        name01: '像素',
        ref01: '2MP/4MP/8MP/200万/400万/800万',
        characteristic: 'MP/万',
        shen: '......',
        label02: '规则',
        name02: '机芯模组',
        rel02: '4'
      }, {
        label01: '需求',
        name01: '焦距',
        ref01: '镜头控制板/10~50mm/10-50mm',
        characteristic: 'mm',
        shen: '......',
        label02: '规则',
        name02: '机芯模组',
        rel02: '4'
      }, {
        label01: '需求',
        name01: '像素',
        ref01: '2MP/4MP/8MP/200万/400万/800万',
        characteristic: 'MP/万',
        shen: '......',
        label02: '规则',
        name02: '镜头',
        rel02: '5'
      }, {
        label01: '需求',
        name01: '焦距',
        ref01: '镜头控制板/10~50mm/10-50mm',
        characteristic: 'mm',
        shen: '......',
        label02: '规则',
        name02: '镜头',
        rel02: '5'
      },
      {
        label01: '需求',
        name01: '算法',
        ref01: '人脸人体检测/行为分析/user_model-款型定制包/sdc_device_type-款型识别包/软件基础包',
        characteristic: '算法/软件',
        shen: '......',
        label02: '规则',
        name02: '产品软件',
        rel02: '3'
      }
      ],
      // 动态表单
      dynamicValidateForm: {
        domains: [{
          value: '',
          attr: '',
          name: ''
        }],
        value: '',
        label: '整机'
      },
      // 动态select器
      configAttr: [],
      configLabel: [],
      timeout: null,

      // tabel 弹窗
      dialogTableVisible: false,
      dialogFormVisible: false,
      countTable: 0,
      countTransfer: 0,
      configList: [],
      pageNumberDialog: 1,
      pageSizeDialog: 100,
      pageNumberTransfer: 1,
      labelClick: '',
      listTitle: '',
      clickId: 0,

      ruleGenSel: '',
      formConfigRule: {
        region1: {
          label: '',
          value: ''
        },
        region2: {
          label: '',
          value: ''
        }
      },
      formLabelWidth: '120px',
      // 规则上传
      RuleFileData: [], // 文件上传数据（多文件合一）
      RuleFileList: [],

      ruleshow: false,
      processshow: false,
      rulesGeneration: [],
      requireRes: {},
      ruleGenTabel: [],
      ruleGenLoading: false,
      ruleLabel: {}
    }
  },
  watch: {
    processRadio() {
      switch (this.processRadio) {
        case 'priority': { this.processshow = false; break }
        case 'coProduction': { this.processshow = false; break }
        default: { this.processshow = false; break }
      }
    }
  },
  mounted() {
    console.log('mainSearch > category', this.category)
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */

    // step 1
    toTemplate(params) {
      window.open(NEO4J_HOST + '/file/download?' + params)
    },
    // 配置规则自动生成文件上传
    uploadFileRule(file) {
      this.RuleFileData.append('files', file.file) // append增加数据
    },
    uploadChangeRule(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.RuleFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    ruleImport() {
      const _this = this
      _this.loading = true
      // 规则 文件
      _this.RuleFileData = new FormData()
      _this.RuleFileData.append('folder', 'rule') // append增加文件夹
      _this.$refs.uploadRule.submit()
      console.log('this.RuleFileData:::', _this.RuleFileData.get('files'))

      knowledgeService.fileUploading(_this.RuleFileData).then(res => {
        // console.log('请求成功:', res)
        res.data.forEach(file => {
          // 需要手动配置后端的绝对路径
          var relPath = file
          console.log('load relPath', relPath)
          _this.$notify({
            message: '上传成功',
            type: 'success',
            duration: 6000
          })
          var param = {
            path: JSON.stringify(relPath),
            folder: 'rule'
            // label: JSON.stringify(file.split('.').slice(-2)[0])
          }
          // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
          knowledgeService.loadcsvMergeAll(param).then(res => {
            _this.$notify({
              message: '预处理成功',
              type: 'success',
              duration: 6000
            })
            _this.loading = false
            _this.ruleLabel.label = res.data.ruleLabel
            _this.querySearchLabelAsync()
            _this.active = 2
          }, err => {
            console.error('预处理失败：', err)
            _this.loading = false
            _this.$notify({
              message: '预处理失败~',
              type: 'error',
              duration: 10000
            })
          })
        })
      }, err => {
        console.error('上传失败：', err)
        _this.loading = false
        _this.$notify({
          message: '上传失败~',
          type: 'error',
          duration: 10000
        })
      })
    },
    // step 2
    ruleView() {
      const _this = this
      _this.ruleloading = true
      _this.ruleshow = true
      _this.ruleGraphVis = false
      const H = {
        label: '需求',
        name: _this.ruleGenSel,
        skip: (Number(_this.pageNumberDialog - 1)) * _this.pageSizeDialog,
        limit: _this.pageSizeDialog
      }

      const params = {
        H: JSON.stringify(H),
        type: 'rule'
      }
      knowledgeService.productConfigurationRuleQuery(params).then(res => {
        console.log('initdata:', res)
        var data = res.data.data
        // 配置结果展示
        _this.rulesGeneration = []
        _this.countList = res.data.count
        data.nodes.forEach(item => {
          var tmpRule = {}
          tmpRule.Q = item[0].labels[0] + ':' + item[0].properties.name
          tmpRule.A = item[1].labels[0] + ':' + item[1].properties.name
          _this.rulesGeneration.push(tmpRule)
        })
      }, err => {
        console.error('需求查询失败：', err)
        _this.loading = false
        _this.$notify({
          message: '需求查询失败~',
          type: 'error',
          duration: 10000
        })
      })
      _this.ruleloading = false
    },
    ruleGraphView() {
      const _this = this
      _this.ruleloading = true
      _this.ruleshow = false
      _this.ruleGraphVis = true
      const H = {
        label: '需求',
        name: _this.ruleGenSel,
        skip: (Number(_this.pageNumberDialog - 1)) * _this.pageSizeDialog,
        limit: _this.pageSizeDialog
      }

      const params = {
        H: JSON.stringify(H),
        type: 'graph'
      }
      knowledgeService.productConfigurationRuleQuery(params).then(res => {
        console.log('initdata:', res)
        var data = res.data.data
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        window.Neo4jd3Rule = Neo4jd3
        window.d3 = d3
        console.log('格式化data:', data)
        window.myDataRuleGen = data
        var timer = null
        // eslint-disable-next-line new-cap
        window.neo4jd3IdRuleGen = new Neo4jd3.default('#neo4jd3IdRuleGen', {
          minCollision: 50,
          neo4jData: window.myDataRuleGen,
          nodeRadius: 25,
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
              window.neo4jd3IdRuleGen.updateWithNeo4jData(data, highlight)
            })
          },
          onRelationshipDoubleClick: function(relationship) {
            console.log(
              'double click on relationship: ', relationship
            )
          },
          zoomFit: true
        })
        _this.ruleloading = false
      }, err => {
        console.error('需求图谱查询失败：', err)
        _this.ruleloading = false
        _this.$notify({
          message: '需求图谱查询失败~',
          type: 'error',
          duration: 10000
        })
      })
    },
    async current_changeDialogPage(currentPage) {
      this.pageNumberDialog = currentPage
      // this.pageNumberMap = currentPage - 1
      await this.ruleView()
    },
    async size_changeDialogPage(pageSize) {
      this.pageSizeDialog = pageSize
      // this.pageNumberMap = currentPage - 1
      await this.ruleView()
    },
    querySearchLabelAsync(queryString, cb) {
      const _this = this
      const H = {
        label: '需求',
        skip: 0,
        limit: 1000
      }
      const data = {
        H: JSON.stringify(H)
      }
      const params = {
        data: JSON.stringify(data)
      }
      console.log('params::', params)
      knowledgeService.querySingleLabel(params).then(res => {
        console.log('res:', res)
        var data = res.data.data
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        _this.configLabel = []
        _this.requireRes = {}
        _this.requireRes = data
        if (cb) {
          data.nodes.forEach(label => {
            var labelObj = {}
            labelObj['value'] = label.properties.name
            labelObj['label'] = label.properties.name
            _this.configLabel.push(labelObj)
          })
          console.log('返回的标签类型：：', _this.configLabel)
          var configLabel = _this.configLabel
          var results = queryString ? configLabel.filter(_this.createStateFilter(queryString)) : configLabel

          clearTimeout(_this.timeout)
          _this.timeout = setTimeout(() => {
            cb(results)
          }, 500 * Math.random())
        }
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    // step 3
    ruleComplete() {
      const _this = this
      _this.ruleGenLoading = true
      _this.ruleGenTabel = []
      _this.requireRes.nodes.forEach(node => {
        const H = {
          label: node.labels[0],
          name: node.properties.name,
          ref: node.properties.ref,
          characteristic: node.properties.characteristic
        }
        const data = {
          H: JSON.stringify(H),
          名称: node.properties.characteristic,
          ruleLabel: _this.ruleLabel,
          skip: 0,
          limit: 1000
        }
        const params = {
          data: JSON.stringify(data)
        }
        console.log('params::', params)
        knowledgeService.productConfigurationRuleReasoning(params).then(res => {
          console.log('ruleComRes::', res)
          var data = res.data.data
          // 转tabel
          data.nodes.forEach(item => {
            var objTmp = {}
            objTmp.Hlabel = item.H.label
            objTmp.Hname = item.H.name
            objTmp.Href = item.H.ref
            objTmp.Hcharacteristic = item.H.characteristic
            objTmp.Tlabel = item.T.label
            objTmp.Tname = item.T.name
            objTmp.prob = item.T.prob.toFixed(2)
            // 查询层级
            const H = {
              label: '整机'
            }
            const T = {
              label: item.T.name
            }
            const data = {
              H: JSON.stringify(H),
              T: JSON.stringify(T)
            }
            const params = {
              data: JSON.stringify(data)
            }
            console.log('paramsLength::', params)
            knowledgeService.queryPathLength(params).then(res => {
              console.log('layer::', res)
              // var data = res.data.data
              objTmp.maxLength = Number(res.data.count) + 2
              _this.ruleGenTabel.push(objTmp)
            }, err => {
              console.error('层级查询失败：', err)
              _this.ruleGenLoading = false
              _this.$notify({
                message: '层级查询失败~',
                type: 'error',
                duration: 10000
              })
            })
          })
          _this.ruleGenLoading = false
        }, err => {
          console.error('推理失败：', err)
          _this.ruleGenLoading = false
          _this.$notify({
            message: '推理失败~',
            type: 'error',
            duration: 10000
          })
        })
      })
    },
    dblclickRow(row, event, column) {
      console.log('val::', row)
      const _this = this
      _this.$confirm('加入配置规则：If ' + row.Hname + ' Then ' + row.Tname + '?', '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.ruleGenLoading = true
        const H = {
          label: row.Hlabel,
          name: row.Hname,
          ref: row.Href,
          characteristic: row.Hcharacteristic
        }
        const T = {
          label: row.Tlabel,
          name: row.Tname
        }
        const R = {
          label: row.maxLength
        }
        const data = {
          H: JSON.stringify(H),
          R: JSON.stringify(R),
          T: JSON.stringify(T)
        }
        const params = {
          data: JSON.stringify(data)
        }
        knowledgeService.productConfigurationRuleCompletion(params).then(res => {
          console.log('res::', res)
          // var data = res.data.data
          _this.$message({
            type: 'success',
            message: '添加成功!'
          })
          _this.ruleGenLoading = false
        }, err => {
          console.error('添加失败：', err)
          _this.ruleGenLoading = false
          _this.$notify({
            message: '添加失败~',
            type: 'error',
            duration: 10000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
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
    margin-top: 20px;
  }
  /* .el-upload-dragger{
    width: 260px;
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
