<template>
  <div style="margin-top: 20px">
    <el-tabs v-model="activeName" style="margin-left:10px; ">
      <el-tab-pane label="代理机构检索" name="1">
        <el-input
          v-model="knvalue"
          autosize
          filterable
          remote
          clearable
          placeholder="代理机构查询"
          style="width: 50%"
        />
        <el-button type="primary" @click="onSubmit">
          搜 索
        </el-button>
        <br><br>
        <!-- 信息院pagesize为10，不可变 -->
        <el-pagination
          :pager-count="5"
          :total="100"
          background
          layout="prev, pager, next"
          @current-change="current_change"
        />
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="patentList"
          :default-sort="{prop: 'date', order: 'descending'}"
          :row_style="{height: '40px'}"
          :cell-style="{height: '40px'}"
          tooltip-effect="dark"
          max-height="1200"
          element-loading-text="Loading"
          border
          height="600"
          highlight-current-row
          style="margin-top:20px;"
        >
          <el-table-column align="center" type="index" label="序号" width="95" />
          <el-table-column label="代理机构" align="center" prop="properties.name" width="350" sortable>
            <template slot-scope="scope">
              <el-popover
                placement="right"
                width="400"
                trigger="click"
              >
                <el-table :data="patentListNb">
                  <el-table-column label="代理机构" align="center" width="300" prop="agencyName" sortable>
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.agencyName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="机构代码" align="center" width="100" prop="agencyCod" sortable>
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.agencyCod }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" align="center" width="50" prop="agencystate" sortable>
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.agencystate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="email" align="center" width="200" prop="email" sortable>
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.email }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="传真" align="center" width="150" prop="fax" sortable>
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.fax }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="联系电话" align="center" width="150" prop="phone" sortable>
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.phone }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="地址" align="center" width="350" prop="unitAddress" sortable>
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.unitAddress }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button slot="reference" @click="onSubmit2(scope.row.properties.name)">
                  <span>{{ scope.row.properties.name }}</span><i class="el-icon-view el-icon--right" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="代理机构图谱" name="2">
        <el-cascader
          v-model="reknType2"
          :options="knTYpeMeeting"
          :props="props"
          placeholder="请选择关键词"
          clearable
          filterable
          remote
          style="width: 20%"
        />
        <el-input
          v-model="knvalue2"
          type="textarea"
          autosize
          filterable
          remote
          clearable
          placeholder="请输入详细内容,多属性查询用换行分割。请注意不支持多余的空行。"
          style="width: 50%"
        />
        <el-button type="primary" @click="onSubmit">
          搜 索
        </el-button>
        <div style="margin-top: 20px">
          <div id="query">
            <div id="neo4jd3Id" class style="height: 650px;">
              没有数据~
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="代理机构分析" name="3">
        <div style="margin-top: 20px">
          <div id="echart">
            <el-card style="margin-left:10px; ">
              <el-collapse>
                <el-collapse-item>
                  <template slot="title">
                    <span style="font-weight: bolder; font-size: 16px; text-align: center; ">代理机构树</span>
                  </template>
                  <div id="echartMain" style="width: 1200px;height:1200px;" />
                </el-collapse-item>
                <el-collapse-item>
                  <template slot="title">
                    <span style="font-weight: bolder; font-size: 16px; text-align: center; ">代理机构地图</span>
                  </template>
                  <div id="echartMain2" style="width: 1200px;height:600px;" />
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'
// import * as echarts from 'echarts'
// eslint-disable-next-line no-unused-vars
// import BMap from 'BMap'
// // eslint-disable-next-line no-unused-vars
// import bmap from 'echarts/extension/bmap/bmap.js'
// import { inputParser } from '@/utils/init.js'
// import { queryInput } from '@/utils/init.js'
import { knowledgeService } from '@/api/resource/knowledge'
import { knTYpeMeeting } from '@/mock/resource'
// import { result2echart } from '@/api/resource/knowledge'
// import { result2map } from '@/api/resource/knowledge'

export default {
  name: 'Visual',
  data() {
    return {
      patentList: [],
      patentListNb: [],
      listLoading: false,
      count: 0,
      knTYpeMeeting: knTYpeMeeting,
      reknType: '',
      reknType2: '',
      reknTypeEdit: '',
      reknTypeEditRes: '',
      knvalue: '',
      knvalue2: '',
      knvalueEdit: '',
      knvalueEditRes: '',
      props: { multiple: true },
      currentData: {}, // 传给d3的数据
      activeName: '1',
      pageNumber: 0,
      list: null
    }
  },
  mounted: function() {
    this.initData()
  },
  methods: {
    // 初始化
    initData() {
      this.listLoading = true
      const _this = this
      _this.init()
      _this.listLoading = false
    },
    async onSubmit() {
      // 代理机构图谱
      this.patentList = []
      // this.pageNumber = 0
      this.listLoading = true
      const _this = this
      var H = {
        label: '代理机构',
        skip: (0 + this.pageNumber) * 5,
        limit: 5,
        name: this.knvalue
      }
      console.log('this.pageNumber', this.pageNumber)
      var params1 = {
        data: JSON.stringify(H)
      }
      await knowledgeService.queryKgInterface(params1).then(res => {
        console.log('res', res)
        const data = res.data.data
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
              data.relationships[r].identity.low
        }
        console.log('datadata', data)
        _this.patentList = data.nodes
        _this.count = res.data.count
        console.log('_this.count:', _this.count)
        // console.log('res:', _this.patentList)
        _this.listLoading = false
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    // table function
    current_change(currentPage) {
      console.log(currentPage)
      this.pageNumber = currentPage
      this.onSubmit()
    },
    onSubmit2(name) {
      this.patentListNb = []
      const _this = this
      this.listLoading = true

      // ninbo info higntech test
      var params2 = {
        AgencyName: name,
        PageIndex: 1
      }
      knowledgeService.queryNbAgency(params2).then(res => {
        _this.res = JSON.parse(res.data)
        console.log('信息院代理机构：', _this.res)
        _this.count = JSON.parse(_this.res).totalItemCount
        _this.res = JSON.parse(_this.res).data
        _this.patentListNb = _this.res
        console.log('res:', _this.patentListNb)
        _this.listLoading = false

        // 加入知识图谱
        knowledgeService.nbAgency2kg(res).then(res => {
          console.log('已加入资源图谱~')
        })
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    regName(scope) {
      if (scope != null) {
        return scope.replace(/%/g, ',')
      } else {
        return scope
      }
    },
    init() {
      const params = {}
      knowledgeService.getInitPatent(params).then(res => {
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
        /* eslint-disable */
          window.neo4jd3 = new Neo4jd3.default('#neo4jd3Id', {
            minCollision: 50,
            neo4jData: window.myData,
            nodeRadius: 25,
            onNodeMouseEnter: function(node) {
              console.log('dianji：', node)
            },
            onNodeDoubleClick: function(node) {
              console.log('dianji：', node)
              const params = {
                id: node.id
              }
              knowledgeService.nodeClick(params).then(res => {
                console.log('点击事件patent:', res)
                res = res.data.data
                //  console.log("成功啦！", data)
                // console.log(data.nodes[0].identity.low)
                // console.log(data.relationships)
                for (var n in res.nodes) {
                  res.nodes[n].id = res.nodes[n].identity.low
                }
                for (var r in res.relationships) {
                  res.relationships[r].id = res.relationships[r].identity.low
                }
                // console.log('成功啦！', data.data)
                window.neo4jd3.resetWithNeo4jData(res)
                // neo4jd3.updateWithNeo4jData(data)
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
<style type="text/css">
  .anchorBL{
    display:none
  }
</style>
