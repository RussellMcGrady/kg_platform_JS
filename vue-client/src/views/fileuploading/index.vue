<template>
  <div id="app" class="my-app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-main style="padding:0 20px 20px 20px;">
        <el-card shadow="never">
          <el-header width="200px">
            <span>图谱批量构建</span>
          </el-header>
          <!-- <all-comment :detail-data="detailData" class="module"/>
          <my-comment :detail-data="detailData" class="module"/>
          <paper-recommend class="module"/> -->
          <el-row style="margin-left: 60px; margin-top: 10px; margin-bottom: 10px">
            <el-col :span="3" style="margin-left: 40px">
              <span>节点文件上传</span>
            </el-col>
            <el-col :span="3" style="margin-left: 430px">
              <span>关系文件上传</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" style="margin-left: 100px">
              <el-upload
                ref="uploadNode"
                :on-change="uploadChangeNode"
                :file-list="nodeFileList"
                :http-request="uploadFileNode"
                :auto-upload="false"
                class="upload-demo"
                drag
                action=""
                multiple
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将节点文件拖到此处，或<em>点击上传</em>
                </div>
                <div slot="tip" class="el-upload__tip">
                  节点文件上传，格式为csv。
                  注意事项：(1)请确保文件属性'name'唯一,且包含标签属性'label'。
                  (2)文件格式为utf-8。
                  (3)文件中所有空格用'-'符号替换。
                  (4)文件中所有"符号用\"符号替换。
                </div>
              </el-upload>
            </el-col>
            <el-col :span="8" style="margin-left: 180px">
              <el-upload
                ref="uploadRel"
                :on-change="uploadChangeRel"
                :file-list="relFileList"
                :http-request="uploadFileRel"
                :auto-upload="false"
                class="upload-demo"
                drag
                action=""
                multiple
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将关系文件拖到此处，或<em>点击上传</em>
                </div>
                <div slot="tip" class="el-upload__tip">
                  关系文件上传，格式为csv
                </div>
              </el-upload>
            </el-col>
          </el-row>
          <el-row type="flex" justify="end" style="margin-top: 10px; margin-bottom: 10px">
            <el-col style="margin-left: 340px">
              <el-button type="warning" icon="el-icon-search" @click="onSubmit">
                节点导入
              </el-button>
            </el-col>
            <el-col style="margin-left: 320px">
              <el-button type="warning" icon="el-icon-search" @click="onSubmit2">
                图谱生成
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
      pathLength: 2,
      // 头、尾结点label
      HreknTypeLabel: '',
      HknTypeLabel: [{
        value: '专利',
        label: '专利'
      }, {
        value: '期刊',
        label: '期刊'
      }, {
        value: '作者',
        label: '作者'
      }],
      TreknTypeLabel: '',
      TknTypeLabel: [{
        value: '专利',
        label: '专利'
      }, {
        value: '期刊',
        label: '期刊'
      }, {
        value: '作者',
        label: '作者'
      }],
      // 头、尾结点property
      HreknType: '',
      HknType: [{
        value: 'name',
        label: '名称'
      }, {
        value: 'id',
        label: 'id'
      }],
      TreknType: '',
      TknType: [{
        value: 'name',
        label: '名称'
      }, {
        value: 'id',
        label: 'id'
      }],
      // H/T input
      Hcontent: '',
      Tcontent: '',
      nodeFileData: [], // 文件上传数据（多文件合一）
      nodeFileList: [],
      relFileData: [], // 文件上传数据（多文件合一）
      relFileList: []
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
    uploadFileNode(file) {
      this.nodeFileData.append('files', file.file) // append增加数据
    },
    uploadFileRel(file) {
      this.relFileData.append('files', file.file) // append增加数据
    },
    uploadChangeNode(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.nodeFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    uploadChangeRel(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.relFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    async onSubmit() {
      // 专利图谱
      const _this = this
      // 文件上传管理
      this.nodeFileData = new FormData()
      this.nodeFileData.append('folder', 'node') // append增加文件夹
      this.$refs.uploadNode.submit()
      console.log('this.fileData:::', this.nodeFileData.get('files'))

      knowledgeService.fileUploading(this.nodeFileData).then(res => {
        // console.log('请求成功:', res)
        res.data.forEach(file => {
          this.loading = true
          // 需要手动配置后端的绝对路径
          var nodePath = file
          console.log('load nodePath', nodePath)
          var param = {
            path: JSON.stringify(nodePath),
            folder: 'node'
            // label: JSON.stringify(file.split('.').slice(-2)[0])
          }
          // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
          knowledgeService.loadcsvMergeOnEntity(param).then(res => {
            if (res.data.code === 20000) {
              _this.$notify({
                message: '节点导入完成~',
                type: 'success',
                duration: 5000
              })
              this.loading = false
            } else {
              _this.$notify({
                message: '添加失败,请检查文件格式。（是否有空的单元格？是否有\'或者\”符号前没有加\\？）',
                type: 'error',
                duration: 10000
              })
            }
          }, err => {
            console.error('路由失败', err)
            this.loading = false
            _this.$notify({
              message: '导入失败~',
              type: 'error',
              duration: 2000
            })
          })
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
    async onSubmit2() {
      // 专利图谱
      const _this = this

      // 文件上传管理
      this.relFileData = new FormData()
      this.relFileData.append('folder', 'relation') // append增加文件夹
      this.$refs.uploadRel.submit()
      console.log('this.fileData:::', this.relFileData.get('files'))

      knowledgeService.fileUploading(this.relFileData).then(res => {
        // console.log('请求成功:', res)
        res.data.forEach(file => {
          this.loading = true
          // 需要手动配置后端的绝对路径
          var relPath = file
          console.log('load relPath', relPath)
          var param = {
            path: JSON.stringify(relPath),
            folder: 'relation'
            // label: JSON.stringify(file.split('.').slice(-2)[0])
          }
          // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
          knowledgeService.loadcsvMergeRelationshipBatchRel(param).then(res => {
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
            _this.$notify({
              message: '关系导入完成~',
              type: 'success',
              duration: 5000
            })
            this.loading = false
          }, err => {
            console.error('关系导入失败：', err)
            this.loading = false
            _this.$notify({
              message: '关系导入失败~',
              type: 'error',
              duration: 10000
            })
          })
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

</style>
