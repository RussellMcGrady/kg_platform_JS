<template>
  <div id="app" class="my-app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-main style="padding:0 20px 20px 20px;">
        <el-card shadow="never">
          <el-header width="200px">
            <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
              <span>产业链分析</span>
            </el-row>
          </el-header>
          <!-- <all-comment :detail-data="detailData" class="module"/>
          <my-comment :detail-data="detailData" class="module"/>
          <paper-recommend class="module"/> -->
          <el-row type="flex" style="margin-top: 10px;line-height:60px;font-weight:600;font-size:18px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
            <span>产业链风险</span>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-input v-model="contentL" placeholder="请输入内容" prefix-icon="el-icon-search" class="input-with-select">
                <el-cascader
                  slot="prepend"
                  v-model="riskValue"
                  :options="riskOptions"
                  :props="{ expandTrigger: 'hover' }"
                  class="select-of-input"
                  @change="handleChange"
                />
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" style="font-weight:500;font-size:10px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
            <span>业务风险：制造企业因为战略决策、供应商交货期、企业的应急管理、产能、产品的质量或故障率、专利等因素，遇到了生产制造中的卡脖子问题。</span>
          </el-row>
          <el-row type="flex" style="margin-top: 10px;line-height:60px;font-weight:600;font-size:18px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
            <span>起始资源</span>
          </el-row>
          <el-row>
            <el-col :span="12">
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
                  placeholder="资源类型"
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
          <el-row type="flex" style="margin-top: 10px;line-height:60px;font-weight:600;font-size:18px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
            <span>查询目标</span>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-input v-model="contentT" placeholder="请输入内容" prefix-icon="el-icon-search" class="input-with-select">
                <el-cascader
                  slot="prepend"
                  v-model="TreknTypeLabel"
                  :options="TknTypeLabel"
                  placeholder="资源特性"
                  clearable
                  filterable
                  remote
                  class="select-of-input"
                  @change="onChange('TL', TreknTypeLabel)"
                />
              </el-input>
              <!-- <el-input v-model="contentT" placeholder="请输入关键词" prefix-icon="el-icon-search" class="input-with-select">
                <el-autocomplete
                  slot="prepend"
                  v-model="labelT"
                  :fetch-suggestions="querySearchLabelAsync"
                  placeholder="资源类型"
                  class="select-of-input"/>
                <el-cascader
                  slot="prepend"
                  v-model="TreknTypeLabel"
                  :options="TknTypeLabel"
                  placeholder="资源特性"
                  clearable
                  filterable
                  remote
                  class="select-of-input"
                  @change="onChange('TL', TreknTypeLabel)"/>
                <el-cascader
                  slot="prepend"
                  v-model="TreknType"
                  :options="TknType"
                  placeholder="特性需求"
                  clearable
                  filterable
                  remote
                  class="select-of-input"
                  @change="onChange('T', TreknType)"/>
              </el-input> -->
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
            <el-col :span="6">
              <el-input-number v-model="pathLength" size="mini" label="关系层数" style="margin-left: 40px" @change="handleChange" />
              <el-button type="warning" icon="el-icon-search" @click="onSubmit2">
                搜索
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-card v-if="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <div id="neo4jd3Id" class style="height: 600px;">
                暂无数据~
              </div>
            </el-card>
          </el-row>
          <!-- 单击图谱节点 -->
          <!-- <el-dialog :visible.sync="dialogVisible" title="核心资源查询" width="60%"> -->
          <!-- <el-input v-model="contentT" placeholder="请输入关键词" prefix-icon="el-icon-search" class="input-with-select">
              <el-autocomplete
                slot="prepend"
                v-model="labelT"
                :fetch-suggestions="querySearchLabelAsync"
                placeholder="资源类型"
                class="select-of-input"/>
              <el-cascader
                slot="prepend"
                v-model="TreknTypeLabel"
                :options="TknTypeLabel"
                placeholder="资源特性"
                clearable
                filterable
                remote
                class="select-of-input"
                @change="onChange('TL', TreknTypeLabel)"/>
              <el-cascader
                slot="prepend"
                v-model="TreknType"
                :options="TknType"
                placeholder="特性需求"
                clearable
                filterable
                remote
                class="select-of-input"
                @change="onChange('T', TreknType)"/>
            </el-input> -->
          <!-- <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit3()">查 询</el-button>
            </div> -->
          <el-dialog
            :visible.sync="dialogTableVisible"
            width="80%"
            title="资源列表"
          >
            <el-col :span="18">
              <el-pagination
                :pager-count="9"
                :total="countList"
                :page-size="10"
                background
                layout="prev, pager, next"
                @current-change="current_changePage"
              />
            </el-col>
            <el-table
              v-if="showTable"
              ref="multipleTable"
              v-loading="loading"
              :data="tableList"
              :row_style="{height: '40px'}"
              :cell-style="{height: '40px'}"
              :summary-method="getSummaries"
              :default-sort="{prop: 'productionCapacity', order: 'descending'}"
              show-summary
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
              <el-table-column label="编码" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.name }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='产能'" label="产能" align="center" width="100" prop="productionCapacity" sortable show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.productionCapacity }} 万台</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='产能'" label="产值" align="center" prop="productionValue" sortable width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.productionValue }} 亿</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='产能'" label="产业" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.industry }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='产能'" label="供应产品" align="center" prop="product" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.product }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='产能'" label="国家" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.country }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='产能'" label="省份" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.province }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='产能'" label="城市" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.city }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='技术'" label="是否进口" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties['进口'] }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='技术'" label="制造方式" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties['制造方式'] }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='技术'" label="规格" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties['规格'] }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='技术'" label="核心物料" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties['核心物料'] }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="riskValue[1]==='技术'" label="类型" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.properties.partType }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <!-- </el-dialog> -->
          <el-dialog
            :visible.sync="dblVisible"
            title="资源图谱"
            width="60%"
          >
            <p>展开的资源类型</p>
            <el-autocomplete
              v-model="labeldblClick"
              :fetch-suggestions="querySearchLabelAsync"
              placeholder="资源类型"
              class="select-of-input"
            />
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="dblGraph(false)">
                取消
              </el-button>
              <el-button type="primary" size="mini" @click="dblGraph(true)">
                确定
              </el-button>
            </div>
          </el-dialog>
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
      riskValue: [],
      riskOptions: [{
        value: '业务风险',
        label: '业务风险',
        children: [{
          value: '产能',
          label: '产能'
        },
        {
          value: '技术',
          label: '专利'
        },
        {
          value: '战略',
          label: '战略'
        },
        {
          value: '质量',
          label: '质量（材料、工艺）'
        },
        {
          value: '故障率',
          label: '故障'
        },
        {
          value: '库存',
          label: '库存（应急管理）'
        }]
      }, {
        value: '生态风险',
        label: '生态风险',
        children: [{
          value: '绿色',
          label: '绿色采购'
        },
        {
          value: '健康',
          label: '健康（有害材料）'
        },
        {
          value: '能耗',
          label: '能耗'
        },
        {
          value: '环保',
          label: '环保（产品回收）'
        }]
      }, {
        value: '文化风险',
        label: '文化风险',
        children: [{
          value: '社会责任',
          label: '社会责任（慈善）'
        },
        {
          value: '信息化',
          label: '信息化能力'
        },
        {
          value: '绩效',
          label: '绩效制度'
        },
        {
          value: '分享',
          label: '分享文化'
        }]
      }, {
        value: '社会风险',
        label: '社会风险',
        children: [{
          value: '社交',
          label: '社交疏远'
        },
        {
          value: '地域',
          label: '地域封锁'
        },
        {
          value: '政策',
          label: '政府政策'
        },
        {
          value: '法律',
          label: '法律责任'
        },
        {
          value: '标准',
          label: '标准指标'
        },
        {
          value: '评价',
          label: '客户评价'
        }]
      }, {
        value: '财务风险',
        label: '财务风险',
        children: [{
          value: '价格控制',
          label: '价格控制'
        },
        {
          value: '研发投入',
          label: '研发投入'
        },
        {
          value: '人才投入',
          label: '人才投入'
        },
        {
          value: '利润',
          label: '利润'
        },
        {
          value: '市场份额',
          label: '市场份额（销售额）'
        },
        {
          value: '资金流',
          label: '资金流（信贷）'
        }]
      }],
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
      contentL: '',
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
      TreknTypeLabel: '',
      TknTypeLabel: [{
        value: '供应商',
        label: '供应商'
      }, {
        value: '产品',
        label: '核心物料'
      }],
      // 头、尾结点property
      // HreknType: '',
      // HknType: [{
      //   value: 'name',
      //   label: 'name'
      // }, {
      //   value: 'id',
      //   label: 'id'
      // }],
      TreknType: '',
      TknType: [{
        value: '=',
        label: '是'
      }, {
        value: '>',
        label: '大于'
      }, {
        value: '<',
        label: '小于'
      }],
      // H/T input
      Hcontent: '',
      Tcontent: '',
      clickId: '',
      labelClick: '',
      labeldblClick: '',

      // table
      dialogVisible: false,
      dialogTableVisible: false,
      countList: 0,
      tableList: [],
      pageNumber: 0,
      labelTable: '',
      showTable: false,
      dblVisible: false,
      sums: []
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
          cb(results)
          // clearTimeout(this.timeout)
          // this.timeout = setTimeout(() => {
          //   cb(results)
          // }, 500 * Math.random())
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
    onChange(item, value) {
      switch (item) {
        // case 'HL': { this.HreknTypeLabel = value; break }
        // case 'H': { this.HreknType = value; break }
        case 'TL': { this.TreknTypeLabel = value[0]; break }
        // case 'T': { this.TreknType = value[0]; break }
        default: { alert('请选择~'); break }
      }
    },
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
      // H['name'] = this.contentH
      var T = {
        label: this.TreknTypeLabel,
        skip: 0,
        limit: 50
      }
      if (this.TreknTypeLabel === '产品') {
        T['核心物料'] = this.contentT
      } else {
        T.name = this.contentT
      }
      // T[this.TreknTypeLabel] = this.contentT
      var assertion = 'ANY'
      // var condition = this.TreknType
      var length = this.pathLength
      var option = 'graph'
      // H[this.reknType] = this.content
      // 用于可视化图谱
      var params1 = {
        H: JSON.stringify(H),
        T: JSON.stringify(T),
        assertion: assertion,
        // condition: condition,
        length: length,
        option: option
      }
      console.log('图谱请求参数：', params1)
      await knowledgeService.assertion(params1).then(res => {
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
    async onSubmit3() {
      // 专利图谱
      const _this = this
      this.dialogTableVisible = true
      this.loading = true
      // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
      // const label = this.getSearchGraphTypeParam()
      // console.log(this.reknType2)
      var H = {
        skip: 0,
        limit: 100
      }
      if (_this.riskValue[1] === '产能') {
        H.label = '供应商'
      } else if (_this.riskValue[1] === '技术') {
        H.label = '产品'
      }
      var T = {
        label: this.labelClick,
        name: ''
      }
      // T[this.TreknTypeLabel] = this.contentT
      var assertion = 'ANY'
      // var condition = this.TreknType
      var length = 1
      var option = 'list'
      // H[this.reknType] = this.content
      // 用于可视化图谱
      var params1 = {
        H: JSON.stringify(H),
        T: JSON.stringify(T),
        assertion: assertion,
        // condition: condition,
        length: length,
        option: option
      }
      console.log('图谱请求参数：', params1)
      await knowledgeService.assertion(params1).then(res => {
        const data = res.data.data
        console.log('patent > onSubmit > 检索结果', data)
        if (data.nodes.length > 0) {
          _this.checkImport = []
          for (var n in data.nodes) {
            // data.nodes[n].id = data.nodes[n].identity.low
            data.nodes[n].productionCapacity = data.nodes[n].properties.productionCapacity
            data.nodes[n].productionValue = data.nodes[n].properties.productionValue
            _this.checkImport.push(data.nodes[n].properties['进口'])
          }
          // for (var r in data.relationships) {
          //   data.relationships[r].id = data.relationships[r].identity.low
          // }
        }
        _this.refreshTable()
        _this.$nextTick(() => {
          if (_this.riskValue[1] === '产能') {
            if (Number(_this.sums[2]) < Number(_this.contentL)) {
              _this.$notify({
                message: '产能不足！',
                type: 'error',
                duration: 2000
              })
            } else if ((Number(_this.sums[2]) - Number(_this.contentL)) / Number(_this.contentL) > 0.1) {
              _this.$notify({
                message: '产能过剩！',
                type: 'warning',
                duration: 2000
              })
            } else if (data.nodes.length === 0) {
              _this.$notify({
                message: '暂无供应商~',
                type: 'warning',
                duration: 2000
              })
            } else {
              _this.$notify({
                message: '产能充足',
                type: 'success',
                duration: 2000
              })
            }
          } else if (_this.riskValue[1] === '技术') {
            if (_this.checkImport.includes(_this.contentL)) {
              _this.$notify({
                message: '符合需求~',
                type: 'success',
                duration: 2000
              })
            } else {
              _this.$notify({
                message: '商品来源不符合国产需求!',
                type: 'error',
                duration: 2000
              })
            }
          }
          _this.countList = res.data.count
          _this.tableList = data.nodes
          _this.loading = false
        })
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
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总量'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = 'N/A'
        }
      })
      this.sums = sums
      return sums
    },
    current_changePage(currentPage) {
      this.pageNumber = currentPage
    },
    handleChange(value) {
      console.log('changeValue::', value)
    },
    refreshTable() {
      this.showTable = false
      this.$nextTick(() => {
        this.showTable = true
      })
    },
    init() {
      const _this = this
      const H = {
        label: _this.hlabel
      }
      const params = {
        data: JSON.stringify(H)
      }
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
          minCollision: 40,
          neo4jData: window.myData,
          nodeRadius: 25,
          // onNodeMouseEnter: function(node) {
          //   console.log('dianji：', node)
          // },
          onNodeDoubleClick: function(node) {
            console.log('dianji：', node)
            clearTimeout(timer)
            timer = setTimeout(function() {
              _this.loading = true
              _this.dblVisible = true
              _this.node = node
            }, 300)
          },
          onNodeClick: function(node) {
            // console.log('dianji：', node)
            clearTimeout(timer)
            timer = setTimeout(function() {
              _this.loading = true
              if (_this.riskValue[1] !== '' && _this.contentL !== '') {
                if (_this.riskValue[1] === '产能' && node.labels.includes('产品')) {
                  _this.labelClick = node.labels
                  // _this.listTitle = getProductLabel(node.labels) + ':' + node.properties.name
                  // _this.clickId = node.id
                  _this.dialogVisible = true
                  // console.log('sdfasd', _this.riskValue)
                  _this.onSubmit3()
                  _this.loading = false
                } else if (_this.riskValue[1] === '技术' && node.labels.includes('产品')) {
                  _this.labelClick = node.labels
                  // _this.listTitle = getProductLabel(node.labels) + ':' + node.properties.name
                  // _this.clickId = node.id
                  _this.dialogVisible = true
                  // console.log('sdfasd', _this.riskValue)
                  _this.onSubmit3()
                  _this.loading = false
                } else {
                  _this.loading = false
                  _this.$notify({
                    message: '请单击产品节点，查看供应商详情~',
                    type: 'warning',
                    duration: 3000
                  })
                }
              } else {
                _this.loading = false
                _this.$notify({
                  message: '请填写风险类型及期望值~',
                  type: 'warning',
                  duration: 3000
                })
              }
            }, 300)
            _this.loading = false
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
    dblGraph(check) {
      const _this = this
      if (check) {
        var node = _this.node
        const params = {
          id: node.id
        }
        const H = {
          label: _this.labeldblClick
        }
        // 是否只展示核心物料
        // if (H.label === '产品') {
        //   H['核心物料'] = '是'
        // }
        params['H'] = JSON.stringify(H)
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
          _this.dblVisible = false
          _this.loading = false
        })
      } else {
        _this.dblVisible = false
        _this.loading = false
      }
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
    width: 220px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
    padding:0 0px;
    border: 0px solid #DCDFE6;
  }

</style>
