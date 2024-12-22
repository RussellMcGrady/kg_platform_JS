<template>
  <div id="app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-container>
        <el-header width="200px" style="line-height:60px;font-weight:600;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;">
          <span>主结构自动生成</span>
        </el-header>
        <el-container>
          <el-main style="padding:0;">
            <el-card shadow="never">
              <el-page-header content="主结构求解" style="margin-bottom: 20px;font-weight:600;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;" @back="goBack" />
              <el-steps :active="stepActive" align-center>
                <el-step title="输入" description="上传BOM和module文件" />
                <el-step title="预求解" description="基于聚类算法的主结构求解" />
                <el-step title="主结构评价" description="根据评价指标和相似树调整产品簇相似度，迭代求解" />
                <el-step title="图谱" description="保存主结构文件，上传主结构节点和关系，生成知识图谱" />
              </el-steps>
              <div v-if="stepActive===1">
                <el-row type="flex" style="margin-top: 60px" justify="center">
                  <el-col :span="10">
                    <el-upload
                      ref="uploadBOM"
                      :on-change="uploadChangeBOM"
                      :file-list="BOMFileList"
                      :http-request="uploadFileBOM"
                      :auto-upload="false"
                      class="upload-demo"
                      drag
                      action=""
                      multiple
                    >
                      <i class="el-icon-upload" />
                      <div class="el-upload__text">
                        将BOM文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div slot="tip" class="el-upload__tip">
                        文件格式要求：utf-8，xlsx。
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col :span="10">
                    <el-upload
                      ref="uploadModule"
                      :on-change="uploadChangeModule"
                      :file-list="ModuleFileList"
                      :http-request="uploadFileModule"
                      :auto-upload="false"
                      class="upload-demo"
                      drag
                      action=""
                      multiple
                    >
                      <i class="el-icon-upload" />
                      <div class="el-upload__text">
                        将module文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div slot="tip" class="el-upload__tip">
                        文件格式要求：utf-8，xlsx。
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col :span="10">
                    <el-upload
                      ref="uploadCorrelation"
                      :on-change="uploadChangeCorrelation"
                      :file-list="CorrelationFileList"
                      :http-request="uploadFileCorrelation"
                      :auto-upload="false"
                      class="upload-demo"
                      drag
                      action=""
                      multiple
                    >
                      <i class="el-icon-upload" />
                      <div class="el-upload__text">
                        将correlation文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div slot="tip" class="el-upload__tip">
                        文件格式要求：utf-8，xlsx。
                      </div>
                    </el-upload>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="end" style="margin-top: 60px;">
                  <el-button-group>
                    <el-button :loading="fileuploading" type="primary" icon="el-icon-upload" @click="fileupload">
                      上传
                    </el-button>
                    <el-button type="info" icon="el-icon-upload" @click="goStep4">
                      图谱
                    </el-button>
                  </el-button-group>
                </el-row>
              </div>
              <div v-if="stepActive===2">
                <el-row type="flex" style="margin-top: 60px;font-weight:600;font-size:18px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="center">
                  <el-col :span="16">
                    <span>期望聚类相似度：</span>
                  </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 40px;" justify="center">
                  <el-col :span="4">
                    <el-progress :percentage="simNum" :color="simColors" type="dashboard" />
                    <div>
                      <el-input-number v-model="simNum" :min="1" :max="100" controls-position="right" size="mini" />
                    </div>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="end" style="margin-top: 40px;">
                  <el-col :span="6">
                    <!-- <el-input v-model="outputFolder" placeholder="命名模板：“名称_相似度”"> -->
                    <el-button :loading="mainStrloading" icon="el-icon-edit" @click="mainStrGen">
                      求解
                    </el-button>
                    <!-- </el-input> -->
                  </el-col>
                </el-row>
              </div>
              <div v-if="stepActive===3">
                <el-collapse v-model="activeNames" style="margin-top: 60px;" @change="collapseChange">
                  <el-collapse-item title="相似树" name="1">
                    <el-row type="flex" style="line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="center">
                      <span>主结构相似树</span>
                    </el-row>
                    <el-row type="flex" style="margin-top: 20px;" justify="center">
                      <!-- <el-col :span="16">
                    <el-card v-loading="mainStrloading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                      <div id="echartColumn" style="height: 600px;">暂无数据~</div>
                    </el-card>
                  </el-col>
                  <el-col :span="4">
                    <el-row type="flex" justify="center" style="margin-top: 10px">
                      <el-slider
                        v-model="simNum"
                        :step="1"
                        :max="100"
                        show-stops
                        show-input
                        vertical
                        height="200px"
                        @change="sliderChange"/>
                    </el-row>
                    <el-row type="flex" justify="center">
                      <el-button :loading="mainStrloading" type="warning" icon="el-icon-edit" size="mini" plain @click="mainStrGen">求解</el-button>
                    </el-row>
                  </el-col> -->
                      <el-image
                        v-if="imgUrl!==null"
                        :src="imgUrl"
                        :preview-src-list="[imgUrl]"
                        lazy
                      />
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="模块化评价" name="2">
                    <el-row type="flex" style="line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="center">
                      <span>通用性与独立性柱状图</span>
                    </el-row>
                    <el-row type="flex" style="margin-top: 20px;" justify="center">
                      <el-col :span="24">
                        <el-card v-loading="mainStrloading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                          <div id="echartColumn" style="height: 600px">
                            暂无数据~
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="主结构方案综合" name="3">
                    <el-row type="flex" style="line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="center">
                      <span>相似性方案综合表</span>
                    </el-row>
                    <el-row type="flex" style="margin-top: 20px;" justify="center">
                      <el-table
                        v-loading="listLoading"
                        id="saveTable"
                        ref="multiTable"
                        :key="tableHight"
                        :data="tableSynthesis"
                        :span-method="objectSpanMethod"
                        :row_style="{height: '40px'}"
                        :cell-style="{height: '40px'}"
                        border
                        stripe
                        tooltip-effect="dark"
                        content="Top center"
                        placement="top"
                        max-height="500"
                        element-loading-text="Loading"
                        highlight-current-row
                        style="width: 100%; margin-top: 20px"
                        @current-change="selectRowChange"
                      >
                        <el-table-column
                          type="selection"
                          width="55"
                        />
                        <el-table-column
                          prop="similarity"
                          label="similarity"
                        />
                        <el-table-column
                          prop="name"
                          label="name"
                        />
                        <el-table-column
                          prop="eval"
                          label="eval"
                        />
                        <el-table-column
                          prop="mty1"
                          label="mty1"
                        />
                        <el-table-column
                          prop="mty2"
                          label="mty2"
                        />
                        <el-table-column
                          prop="mty3"
                          label="mty3"
                        />
                        <el-table-column
                          prop="mty4"
                          label="mty4"
                        />
                        <el-table-column
                          prop="mty5"
                          label="mty5"
                        />
                        <el-table-column
                          prop="mty6"
                          label="mty6"
                        />
                        <el-table-column
                          prop="mty7"
                          label="mty7"
                        />
                        <el-table-column
                          prop="mdl"
                          label="mdl"
                        />
                      </el-table>
                    </el-row>
                    <el-row type="flex" style="margin-top: 20px;" justify="end">
                      <el-button :loading="mainStrloading" size="small" type="success" plain @click="saveConfig2Exel">
                        保存
                      </el-button>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <el-row type="flex" style="margin-top: 20px;" justify="end">
                  <el-col :span="4">
                    <el-input-number v-model="simNum" :precision="2" :step="0.1" :max="100" size="mini" />
                  </el-col>
                  <el-col :span="6">
                    <el-button :loading="mainStrloading" type="warning" icon="el-icon-edit" size="mini" plain @click="mainStrGen">
                      求解
                    </el-button>
                  </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 40px; margin-right: 80px;" justify="end">
                  <el-col :span="8">
                    <el-button-group>
                      <el-button type="primary" icon="el-icon-download" plain @click="mainStrDownload">
                        下载
                      </el-button>
                      <el-button type="success" icon="el-icon-circle-check" plain @click="goStep4">
                        下一步
                      </el-button>
                    </el-button-group>
                  </el-col>
                </el-row>
              </div>
              <div v-if="stepActive===4">
                <el-row type="flex" style="margin-top: 60px;" justify="center">
                  <el-col :span="10">
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
                        注意事项：(1)节点属性'name'唯一,且包含标签属性'label'。
                        (2)文件格式为utf-8。
                        (3)文件中所有空格用'-'符号替换。
                        (4)文件中所有"符号用\"符号替换。
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col :span="10">
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
                <el-row type="flex" justify="end" style="margin-top: 40px;">
                  <el-col :span="11">
                    <el-button-group>
                      <el-button v-show="nodeUpload===true" :loading="nodeLoading" size="medium" type="primary" icon="el-icon-setting" plain @click="onUploadNode">
                        上传节点
                      </el-button>
                      <el-button v-show="relUpload===true" :loading="relLoading" size="medium" type="success" icon="el-icon-share" plain @click="onUploadRel">
                        图谱求解
                      </el-button>
                      <el-button size="medium" type="info" icon="el-icon-refresh" plain @click="goRefresh">
                        首页
                      </el-button>
                    </el-button-group>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="center" style="margin-top: 40px;">
                  <card v-loading="graphLoading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div id="neo4jd3Id" class style="height: 600px;width: 1000px;">
                      暂无数据~
                    </div>
                  </card>
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
import { knowledgeService, result2EvalCol } from '@/api/resource/knowledge'
import { NEO4J_HOST } from '../../../config/config'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'
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
      stepActive: 1,
      // step 1
      fileuploading: false,
      mainStrloading: false,
      ModuleFileData: [], // 文件上传数据（多文件合一）
      ModuleFileList: [],
      BOMFileData: [], // 文件上传数据（多文件合一）
      BOMFileList: [],
      BOMFile: '',
      moduleFile: '',
      // step 2
      simNum: 35,
      simColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      outputFolder: 'mainStructure_35',
      // step 3
      activeNames: ['1', '2'],
      mainStrUrl: '',
      mainStrRes: '',
      resCol: [],
      imgUrl: null,
      inputSheetNum: 'Sheet1',
      CorrelationFileData: [], // 文件上传数据（多文件合一）
      CorrelationFileList: [],
      FamilyFileData: [], // 文件上传数据（多文件合一）
      FamilyFileList: [],
      FamilyFile: '',
      CorrelationFile: '',
      indepRes: '',
      tableSynthesis: [],
      listLoading: false,
      simCount: [],
      tableHight: 1,
      // 表格合并
      rowIndex: '-1',
      OrderIndexArr: [],
      hoverOrderArr: [],
      // step 4
      nodeFileData: [], // 文件上传数据（多文件合一）
      nodeFileList: [],
      relFileData: [], // 文件上传数据（多文件合一）
      relFileList: [],
      nodeLoading: false,
      relLoading: false,
      graphLoading: false,
      nodeUpload: true,
      relUpload: false
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
    },
    simNum() {
      this.outputFolder = this.outputFolder.split('_')[0] + '_' + this.simNum
    },
    listLoading() {
      ++this.tableHight
    }
  },
  mounted() {
    // console.log('mainSearch > category', this.category)
    // this.init()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    // 主结构文件上传
    uploadChangeBOM(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.BOMFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    uploadChangeModule(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.ModuleFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    uploadFileBOM(file) {
      this.BOMFileData.append('files', file.file) // append增加数据
    },
    uploadFileModule(file) {
      this.ModuleFileData.append('files', file.file) // append增加数据
    },
    // 步骤1
    fileupload() {
      const _this = this
      _this.fileuploading = true
      if (_this.BOMFileData !== [] && _this.ModuleFileData !== [] && _this.CorrelationFileData !== []) {
        // BOM 文件
        _this.BOMFileData = new FormData()
        _this.BOMFileData.append('folder', 'BOM') // append增加文件夹
        _this.$refs.uploadBOM.submit()
        console.log('this.BOMFileData:::', _this.BOMFileData.get('files'))
        // module 文件
        _this.ModuleFileData = new FormData()
        _this.ModuleFileData.append('folder', 'Module') // append增加文件夹
        _this.$refs.uploadModule.submit()
        console.log('this.ModuleFileData:::', _this.ModuleFileData.get('files'))
        // Correlation 文件
        _this.CorrelationFileData = new FormData()
        _this.CorrelationFileData.append('folder', 'Correlation') // append增加文件夹
        _this.$refs.uploadCorrelation.submit()
        console.log('this.CorrelationFileData:::', _this.CorrelationFileData.get('files'))

        // 需求导入图谱
        knowledgeService.fileUploading(_this.BOMFileData).then(res => {
        // console.log('请求成功:', res)
          res.data.forEach(file => {
            // 需要手动配置后端的绝对路径
            _this.BOMFile = file
            console.log('load BOMFile', _this.BOMFile)
            _this.$notify({
              message: 'BOM上传完成~',
              type: 'success',
              duration: 5000
            })
          })
          // 需求图谱补全
          knowledgeService.fileUploading(_this.ModuleFileData).then(res => {
            // console.log('请求成功:', res)
            res.data.forEach(file => {
              // 需要手动配置后端的绝对路径
              _this.moduleFile = file
              console.log('load moduleFile', _this.moduleFile)
            })
            _this.$notify({
              message: 'module上传完成~',
              type: 'success',
              duration: 5000
            })
            knowledgeService.fileUploading(_this.CorrelationFileData).then(async res => {
            // console.log('请求成功:', res)
              res.data.forEach(file => {
              // 需要手动配置后端的绝对路径
                _this.CorrelationFile = file
                console.log('load CorrelationFile', _this.CorrelationFile)
              })
              _this.$notify({
                message: 'correlation上传完成~',
                type: 'success',
                duration: 5000
              })
              _this.fileuploading = false
              setTimeout(() => {
                _this.stepActive = 2
              }, 500)
            }, err => {
              console.error('correlation上传失败：', err)
              _this.$notify({
                message: 'correlation上传失败~',
                type: 'error',
                duration: 10000
              })
              _this.fileuploading = false
            })
          }, err => {
            console.error('module上传失败：', err)
            _this.$notify({
              message: 'module上传失败~',
              type: 'error',
              duration: 10000
            })
            _this.fileuploading = false
          })
        }, err => {
          console.error('BOM上传失败：', err)
          _this.$notify({
            message: 'BOM上传失败~',
            type: 'error',
            duration: 2000
          })
          _this.fileuploading = false
        })
      }
    },
    // 步骤2
    mainStrGen() {
      const _this = this
      _this.mainStrloading = true
      _this.listLoading = true
      var params = {
        moduleFile: _this.moduleFile,
        BOMFile: _this.BOMFile,
        correlationFile: _this.CorrelationFile,
        similarity: _this.simNum,
        outputFolder: _this.outputFolder,
        eval: true
      }
      knowledgeService.mainStructureGen(params).then(res => {
        console.log('请求成功:', res)
        _this.mainStrUrl = NEO4J_HOST + res.data.url
        _this.mainStrRes = res.data.data
        // console.log('_this.mainStrRes::', _this.mainStrRes)
        // _this.resCol = result2MainStrCol(_this.mainStrRes)
        // console.log('_this.resCol::', _this.resCol)
        _this.imgUrl = NEO4J_HOST + res.data.imgUrl
        _this.resCol = result2EvalCol(_this.mainStrRes)
        console.log('_this.resCol::', _this.resCol)
        _this.$notify({
          message: '生成完毕~',
          type: 'success',
          duration: 5000
        })
        // 结果加入列表
        if (!_this.simCount.includes(_this.simNum)) {
          for (var i = 1; i < _this.resCol.length; i++) {
            var rowObj = {}
            var sum = 0
            rowObj.name = _this.resCol[i][0]
            rowObj.similarity = _this.simNum
            for (var j = 1; j < _this.resCol[i].length; j++) {
              switch (j) {
                case 1: { rowObj.mty1 = _this.resCol[i][j]; break }
                case 2: { rowObj.mty2 = _this.resCol[i][j]; break }
                case 3: { rowObj.mty3 = _this.resCol[i][j]; break }
                case 4: { rowObj.mty4 = _this.resCol[i][j]; break }
                case 5: { rowObj.mty5 = _this.resCol[i][j]; break }
                case 6: { rowObj.mty6 = _this.resCol[i][j]; break }
                case 7: { rowObj.mty7 = _this.resCol[i][j]; break }
                case 8: { rowObj.mdl = _this.resCol[i][j]; break }
                default: { break }
              }
              sum += Number(_this.resCol[i][j])
            }
            rowObj.eval = (sum / 8).toFixed(2)
            _this.tableSynthesis.push(rowObj)
          }
          _this.simCount.push(_this.simNum)
          _this.getOrderNumber()
          console.log('tableSynthesis::', _this.tableSynthesis)
        }
        _this.mainStrloading = false
        _this.listLoading = false
        _this.stepActive = 3
        setTimeout(() => {
          _this.initEchartColumn()
        }, 500)
      }, err => {
        console.error('求解失败：', err)
        _this.$notify({
          message: '求解失败~',
          type: 'error',
          duration: 2000
        })
        _this.mainStrloading = false
        _this.listLoading = false
      })
    },
    // 步骤3
    collapseChange(val) {
      val.forEach(item => {
        if (item === '2') {
          setTimeout(() => {
            this.initEchartColumn()
          }, 500)
        }
      })
    },
    initEchartColumn() {
      const _this = this
      var myChart = echarts.init(document.getElementById('echartColumn'))
      // myChart.showLoading('default', { text: '统计中，请稍候...', maskColor: '#404a59', textColor: '#fff' })
      myChart.clear()
      myChart.hideLoading()
      myChart.setOption(_this.option = {
        legend: {},
        tooltip: {},
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
              show: true,
              excludeComponents: ['toolbox'],
              pixelRatio: 1
            }
          }
        },
        dataset: {
          source: _this.resCol
        },
        xAxis: { type: 'category' },
        yAxis: {},

        series: [
        // These series are in the second grid.
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
          // { type: 'bar', barWidth: 5 }
        ]
      })
    },
    uploadChangeFamily(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.FamilyFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    uploadChangeCorrelation(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.CorrelationFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    uploadFileFamily(file) {
      this.FamilyFileData.append('files', file.file) // append增加数据
    },
    uploadFileCorrelation(file) {
      this.CorrelationFileData.append('files', file.file) // append增加数据
    },
    // 合并相同行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        for (var i = 0; i < this.OrderIndexArr.length; i++) {
          var element = this.OrderIndexArr[i]
          for (var j = 0; j < element.length; j++) {
            var item = element[j]
            if (rowIndex === item) {
              if (j === 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                }
              } else if (j !== 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                }
              }
            }
          }
        }
      }
    },
    getOrderNumber() {
      var OrderObj = {}
      this.tableSynthesis.forEach((element, index) => {
        element.rowIndex = index
        if (OrderObj[element.similarity]) {
          OrderObj[element.similarity].push(index)
        } else {
          OrderObj[element.similarity] = []
          OrderObj[element.similarity].push(index)
        }
      })

      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      this.OrderIndexArr = []
      for (var k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k])
        }
      }
      console.log('this.OrderIndexArr::', this.OrderIndexArr)
    }, // 合并相同行

    // indepUpload() {
    //   const _this = this
    //   _this.fileuploading = true
    //   if (_this.FamilyFileData !== [] && _this.CorrelationFileData !== []) {
    //     // Family 文件
    //     _this.FamilyFileData = new FormData()
    //     _this.FamilyFileData.append('folder', 'independence') // append增加文件夹
    //     _this.$refs.uploadFamily.submit()
    //     console.log('this.FamilyFileData:::', _this.FamilyFileData.get('files'))
    //     // Correlation 文件
    //     _this.CorrelationFileData = new FormData()
    //     _this.CorrelationFileData.append('folder', 'independence') // append增加文件夹
    //     _this.$refs.uploadCorrelation.submit()
    //     console.log('this.CorrelationFileData:::', _this.CorrelationFileData.get('files'))

    //     // 需求导入图谱
    //     knowledgeService.fileUploading(_this.FamilyFileData).then(res => {
    //     // console.log('请求成功:', res)
    //       res.data.forEach(file => {
    //         // 需要手动配置后端的绝对路径
    //         _this.FamilyFile = file
    //         console.log('load FamilyFile', _this.FamilyFile)
    //         _this.$notify({
    //           message: 'family上传完成~',
    //           type: 'success',
    //           duration: 5000
    //         })
    //       })
    //       // 需求图谱补全
    //       knowledgeService.fileUploading(_this.CorrelationFileData).then(async res => {
    //         // console.log('请求成功:', res)
    //         res.data.forEach(file => {
    //           // 需要手动配置后端的绝对路径
    //           _this.CorrelationFile = file
    //           console.log('load CorrelationFile', _this.CorrelationFile)
    //         })
    //         _this.$notify({
    //           message: 'correlation上传完成~',
    //           type: 'success',
    //           duration: 5000
    //         })
    //         // 计算产品簇独立性
    //         _this.independenceEval()

    //         _this.fileuploading = false
    //       }, err => {
    //         console.error('correlation上传失败：', err)
    //         _this.fileuploading = false
    //         _this.$notify({
    //           message: 'correlation上传失败~',
    //           type: 'error',
    //           duration: 10000
    //         })
    //         _this.fileuploading = false
    //       })
    //     }, err => {
    //       console.error('family上传失败：', err)
    //       _this.$notify({
    //         message: 'family上传失败~',
    //         type: 'error',
    //         duration: 2000
    //       })
    //       _this.fileuploading = false
    //     })
    //   }
    // },
    // independenceEval() {
    //   const _this = this
    //   _this.mainStrloading = true
    //   var params = {
    //     correlationFile: _this.CorrelationFile,
    //     familyFile: _this.FamilyFile
    //   }
    //   knowledgeService.independenceEval(params).then(res => {
    //     console.log('请求成功:', res)
    //     var data = res.data.data
    //     _this.indepRes = data.split('\n')[1].replace(',', '=')
    //     console.log('_this.indepRes::', _this.indepRes)
    //     _this.$notify({
    //       message: '生成完毕~',
    //       type: 'success',
    //       duration: 5000
    //     })
    //     _this.mainStrloading = false
    //     _this.stepActive = 3
    //   }, err => {
    //     console.error('求解失败：', err)
    //     _this.$notify({
    //       message: '求解失败~',
    //       type: 'error',
    //       duration: 2000
    //     })
    //     _this.mainStrloading = false
    //   })
    // },
    // initEchartColumn() {
    //   const _this = this
    //   var myChart = echarts.init(document.getElementById('echartColumn'))
    //   // myChart.showLoading('default', { text: '统计中，请稍候...', maskColor: '#404a59', textColor: '#fff' })
    //   myChart.clear()
    //   myChart.hideLoading()
    //   myChart.setOption(_this.option = {
    //     dataset: {
    //       source: _this.resCol
    //     },
    //     grid: { containLabel: true },
    //     yAxis: { name: '相似度' },
    //     xAxis: { type: 'category' },
    //     visualMap: {
    //       orient: 'horizontal',
    //       left: 'center',
    //       min: 30,
    //       max: 80,
    //       text: ['高相似度', '低相似度'],
    //       // Map the score column to color
    //       dimension: 1,
    //       inRange: {
    //         color: ['#65B581', '#FFCE34', '#FD665F']
    //       }
    //     },
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: { // 坐标轴指示器，坐标轴触发有效
    //         type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    //       }
    //     },
    //     series: [
    //       {
    //         type: 'bar',
    //         encode: {
    //           // Map the "amount" column to X axis.
    //           y: 'amount',
    //           // Map the "product" column to Y axis
    //           x: 'product'
    //         },
    //         markLine: {
    //           symbol: ['none', 'none'],
    //           data: [{
    //             yAxis: _this.simNum
    //           }]
    //         }
    //       }
    //     ]
    //   })
    // },
    // sliderChange() {
    //   this.initEchartColumn()
    // },

    selectRowChange(val) {
      var nameParam = 'name=' + this.outputFolder.split('_')[0] + '_' + val.similarity + '.zip'
      this.mainStrUrl = this.mainStrUrl.split('&')[0] + '&' + nameParam + '&' + this.mainStrUrl.split('&')[2]
      console.log('this.mainStrUrl::', this.mainStrUrl)
    },
    saveConfig2Exel() {
      // this.savepagesize = 1000// 表格长度变长
      // this.pageNumberDialog = 1
      // this.$nextTick(function() {
      this.listLoading = true
      var tableSave
      var wb
      tableSave = document.querySelector('#saveTable')
      wb = XLSX.utils.table_to_book(tableSave)
      /* get binary string as output */
      const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        var saveName = '主结构相似度综合统计表.xlsx'
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
    mainStrDownload() {
      window.open(this.mainStrUrl, '_blank')
    },

    // step 4
    init() {
      const H = {
        label: '主结构'
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
    uploadFileNode(file) {
      this.nodeFileData.append('files', file.file) // append增加数据
    },
    uploadFileRel(file) {
      this.relFileData.append('files', file.file) // append增加数据
    },
    onUploadNode() {
      const _this = this
      _this.nodeLoading = true
      _this.graphLoading = true
      if (_this.nodeFileData !== []) {
        // 节点文件
        _this.nodeFileData = new FormData()
        _this.nodeFileData.append('folder', 'node') // append增加文件夹
        _this.$refs.uploadNode.submit()
        console.log('this.nodeFileData:::', _this.nodeFileData.get('files'))

        // 需求导入图谱
        knowledgeService.fileUploading(_this.nodeFileData).then(res => {
        // console.log('请求成功:', res)
          res.data.forEach(file => {
            // 需要手动配置后端的绝对路径
            var nodePath = file
            console.log('load nodePath', nodePath)
            var param = {
              path: JSON.stringify(nodePath),
              folder: 'node'
            }
            // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
            knowledgeService.loadcsvMergeOnEntity(param).then(res => {
              if (res.data.code === 20000) {
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
                window.neo4jd3.resetWithNeo4jData(data)
                _this.$notify({
                  message: '节点导入完成~',
                  type: 'success',
                  duration: 5000
                })
                _this.nodeLoading = false
                _this.graphLoading = false
                _this.nodeUpload = false
                _this.relUpload = true
              } else {
                _this.nodeLoading = false
                _this.graphLoading = false
                _this.$notify({
                  message: '添加失败,请检查文件格式。（是否有空的单元格？是否有\'或者\”符号前没有加\\？）',
                  type: 'error',
                  duration: 10000
                })
              }
            }, err => {
              console.error('路由失败', err)
              _this.nodeLoading = false
              _this.graphLoading = false
              _this.$notify({
                message: '导入失败~',
                type: 'error',
                duration: 2000
              })
            })
          })
        }, err => {
          console.error('节点上传失败：', err)
          _this.$notify({
            message: '节点上传失败~',
            type: 'error',
            duration: 2000
          })
          _this.nodeLoading = false
          _this.graphLoading = false
        })
      }
    },
    onUploadRel() {
      const _this = this
      _this.relLoading = true
      _this.graphLoading = true
      if (_this.relFileData !== []) {
        // 关系文件
        _this.relFileData = new FormData()
        _this.relFileData.append('folder', 'relation') // append增加文件夹
        _this.$refs.uploadRel.submit()
        console.log('this.relFileData:::', _this.relFileData.get('files'))

        // 需求导入图谱
        knowledgeService.fileUploading(_this.relFileData).then(res => {
        // console.log('请求成功:', res)
          res.data.forEach(file => {
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
              // 图谱需求submit
              window.neo4jd3.resetWithNeo4jData(data)
              _this.$notify({
                message: '关系导入完成~',
                type: 'success',
                duration: 5000
              })
              _this.relLoading = false
              _this.graphLoading = false
              _this.nodeUpload = true
              _this.relUpload = false
            }, err => {
              console.error('关系导入失败：', err)
              _this.relLoading = false
              _this.graphLoading = false
              _this.$notify({
                message: '关系导入失败~',
                type: 'error',
                duration: 10000
              })
            })
          })
        }, err => {
          console.error('关系上传失败：', err)
          _this.$notify({
            message: '关系上传失败~',
            type: 'error',
            duration: 2000
          })
          _this.relLoading = false
          _this.graphLoading = false
        })
      }
    },

    goStep4() {
      this.stepActive = 4
      this.init()
    },
    goBack() {
      this.stepActive -= 1
    },
    goRefresh() {
      this.activeNames = ['1', '2']
      this.mainStrUrl = ''
      this.mainStrRes = ''
      this.resCol = []
      this.imgUrl = null
      this.CorrelationFile = ''
      this.indepRes = ''
      this.tableSynthesis = []
      this.listLoading = false
      // 表格合并
      this.rowIndex = '-1'
      this.OrderIndexArr = []
      this.hoverOrderArr = []
      this.stepActive = 1
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
  .el-upload .el-upload-dragger {
    width: 300px;
  }
  .divShow {
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
