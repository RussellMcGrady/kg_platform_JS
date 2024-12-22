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
                <el-step title="上传数据" description="上传原始BOM，本体模板，以及模板BOM文件" />
                <el-step title="数据校验" description="基于聚类算法的主结构求解" />
                <el-step title="结果预览" description="分析结果系统可视化展示" />
                <el-step title="图谱生成" description="上传节点和关系文件，生成知识图谱" />
              </el-steps>
              <div v-if="stepActive===1">
                <el-row type="flex" style="margin-top: 60px" justify="center">
                  <el-col :span="6">
                    <el-upload
                      ref="uploadBOM"
                      :on-change="uploadChangeBOM"
                      :file-list="BOMFileList"
                      :http-request="uploadFileBOM"
                      :auto-upload="false"
                      :limit="1"
                      class="upload-demo"
                      drag
                      action=""
                      multiple
                    >
                      <i class="el-icon-upload" />
                      <div class="el-upload__text">
                        将原始BOM文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div slot="tip" class="el-upload__tip">
                        文件格式要求：utf-8，xlsx。要求四个表的表名区分大小且一致，默认"Sheet1"。
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col :span="6">
                    <el-upload
                      ref="uploadModule"
                      :on-change="uploadChangeModule"
                      :file-list="ModuleFileList"
                      :http-request="uploadFileModule"
                      :auto-upload="false"
                      :limit="1"
                      class="upload-demo"
                      drag
                      action=""
                      multiple
                    >
                      <i class="el-icon-upload" />
                      <div class="el-upload__text">
                        将模板文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div slot="tip" class="el-upload__tip">
                        文件格式要求：utf-8，xlsx。要求四个表的表名区分大小且一致，默认"Sheet1"。
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col :span="6">
                    <el-upload
                      ref="uploadCorrelation"
                      :on-change="uploadChangeCorrelation"
                      :file-list="CorrelationFileList"
                      :http-request="uploadFileCorrelation"
                      :auto-upload="false"
                      :limit="1"
                      class="upload-demo"
                      drag
                      action=""
                      multiple
                    >
                      <i class="el-icon-upload" />
                      <div class="el-upload__text">
                        将模板BOM文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div slot="tip" class="el-upload__tip">
                        文件格式要求：utf-8，xlsx。要求四个表的表名区分大小且一致，默认"Sheet1"。
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col :span="6">
                    <el-upload
                      ref="uploadEval"
                      :on-change="uploadChangeEval"
                      :file-list="evalFileList"
                      :http-request="uploadFileEval"
                      :auto-upload="false"
                      :limit="1"
                      class="upload-demo"
                      drag
                      action=""
                      multiple
                    >
                      <i class="el-icon-upload" />
                      <div class="el-upload__text">
                        将模块设计特性文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div slot="tip" class="el-upload__tip">
                        文件格式要求：utf-8，xlsx。要求四个表的表名区分大小且一致，默认"Sheet1"。
                      </div>
                    </el-upload>
                  </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 60px" justify="center">
                  <el-col :span="6">
                    <el-button type="text" @click="toTemplate('dir=mainStructure&name=输入1 原始bom-模板.xlsx')">
                      下载原始BOM模板<i class="el-icon-view el-icon--right" />
                    </el-button>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="text" @click="toTemplate('dir=mainStructure&name=输入2 模板bom-模板.xlsx')">
                      下载模板文件模板<i class="el-icon-view el-icon--right" />
                    </el-button>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="text" @click="toTemplate('dir=mainStructure&name=输入3 模板bom的物料清单-模板.xlsx')">
                      下载模板BOM模板<i class="el-icon-view el-icon--right" />
                    </el-button>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="text" @click="toTemplate('dir=mainStructure&name=输入4 独立性评价输入-模板.xlsx')">
                      下载独立性评价模板<i class="el-icon-view el-icon--right" />
                    </el-button>
                  </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 60px;;line-height:60px;font-weight:600;font-size:15px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="center">
                  <el-col :span="6">
                    <span>通用性权重</span>
                  </el-col>
                  <el-col :span="6">
                    <span>复用次数权重</span>
                  </el-col>
                  <el-col :span="6">
                    <span>独立性权重</span>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                  <el-col :span="6">
                    <el-input-number v-model="genNum" :min="0" :max="100" controls-position="right" size="mini" />
                  </el-col>
                  <el-col :span="6">
                    <el-input-number v-model="reuseNum" :min="0" :max="100" controls-position="right" size="mini" />
                  </el-col>
                  <el-col :span="6">
                    <el-input-number v-model="indivNum" :min="0" :max="100" controls-position="right" size="mini" />
                  </el-col>
                </el-row>
              </div>
              <div v-if="stepActive===2">
                <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                  <span>原始BOM预览</span>
                </el-row>
                <el-table
                  v-loading="computeLoading"
                  :data="inputTabelListBOM"
                  :row_style="{height: '40px'}"
                  :cell-style="{height: '40px'}"
                  stripe
                  tooltip-effect="dark"
                  content="Top center"
                  placement="top"
                  max-height="1200"
                  element-loading-text="Loading"
                  border
                  height="350"
                  highlight-current-row
                >
                  <el-table-column align="center" type="index" label="序号" width="80" />
                  <el-table-column v-for="index in Object.keys(inputTabelListBOM[0]).length" :key="index" :label="index.toString()" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row[index - 1] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                  <span>模板预览</span>
                </el-row>
                <el-table
                  v-loading="computeLoading"
                  :data="inputTabelListModule"
                  :row_style="{height: '40px'}"
                  :cell-style="{height: '40px'}"
                  stripe
                  tooltip-effect="dark"
                  content="Top center"
                  placement="top"
                  max-height="1200"
                  element-loading-text="Loading"
                  border
                  height="350"
                  highlight-current-row
                >
                  <el-table-column align="center" type="index" label="序号" width="80" />
                  <el-table-column v-for="index in Object.keys(inputTabelListModule[0]).length" :key="index" :label="index.toString()" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row[index - 1] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                  <span>模板BOM预览</span>
                </el-row>
                <el-table
                  v-loading="computeLoading"
                  :data="inputTabelListCorrelation"
                  :row_style="{height: '40px'}"
                  :cell-style="{height: '40px'}"
                  stripe
                  tooltip-effect="dark"
                  content="Top center"
                  placement="top"
                  max-height="1200"
                  element-loading-text="Loading"
                  border
                  height="350"
                  highlight-current-row
                >
                  <el-table-column align="center" type="index" label="序号" width="80" />
                  <el-table-column v-for="index in Object.keys(inputTabelListCorrelation[0]).length" :key="index" :label="index.toString()" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row[index - 1] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                  <span>模块设计特性表预览</span>
                </el-row>
                <el-table
                  v-loading="computeLoading"
                  :data="inputTabelListEval"
                  :row_style="{height: '40px'}"
                  :cell-style="{height: '40px'}"
                  stripe
                  tooltip-effect="dark"
                  content="Top center"
                  placement="top"
                  max-height="1200"
                  element-loading-text="Loading"
                  border
                  height="350"
                  highlight-current-row
                >
                  <el-table-column align="center" type="index" label="序号" width="80" />
                  <el-table-column v-for="index in Object.keys(inputTabelListEval[0]).length" :key="index" :label="index.toString()" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row[index - 1] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" style="margin-top: 20px;" justify="center">
                  <el-col :span="8">
                    <el-button :loading="computeLoading" type="warning" icon="el-icon-edit-outline" @click="mainStrGen">
                      求解
                    </el-button>
                  </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 20px;" justify="end">
                  <el-button v-if="stepActive===2" size="small" type="success" icon="el-icon-download" plain @click="downloadRes">
                    下载
                  </el-button>
                  <el-upload
                    v-if="stepActive===2"
                    :file-list="resList"
                    :on-change="uploadResChange"
                    :auto-upload="false"
                    action=""
                    class="upload-demo"
                    multiple
                  >
                    <el-button slot="trigger" size="small" type="warning" plain icon="el-icon-view">
                      选取结果文件
                    </el-button>
                  </el-upload>
                </el-row>
              </div>
              <div v-if="stepActive===3">
                <el-row type="flex" style="margin-top: 60px;margin-bottom: 40px;" justify="left">
                  <span style="font-size: 15px; font-weight: bold;font-family: Avenir, Helvetica, Arial, sans-serif;">结果展示：</span>
                </el-row>
                <el-table
                  id="srpgtable"
                  ref="multipleTable"
                  v-loading="resLoading"
                  :data="outputTabelList"
                  :row_style="{height: '40px'}"
                  :cell-style="{height: '40px'}"
                  stripe
                  tooltip-effect="dark"
                  content="Top center"
                  placement="top"
                  max-height="1200"
                  element-loading-text="Loading"
                  border
                  height="750"
                  highlight-current-row
                >
                  <el-table-column align="center" type="index" label="序号" width="80" />
                  <el-table-column v-for="index in Object.keys(outputTabelList[0]).length" :key="index" :label="index.toString()" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row[index - 1] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
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
                        上传关系
                      </el-button>
                      <el-button size="medium" type="info" icon="el-icon-refresh" plain @click="goRefresh">
                        首页
                      </el-button>
                    </el-button-group>
                  </el-col>
                </el-row>
                <el-row>
                  <el-card v-loading="graphLoading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                    <el-radio-group v-model="showRadio" style="height:36px;line-height: 36px;margin-left: 40px;padding: 4px;">
                      <el-radio label="graph">
                        配置图谱
                      </el-radio>
                      <el-radio label="tree">
                        配置树
                      </el-radio>
                    </el-radio-group>
                    <div v-show="showRadio==='graph'" id="neo4jd3Id" class style="height: 600px;width: 1000px;">
                      暂无数据~
                    </div>
                    <div v-show="showRadio==='tree'" id="echartTree" style="height: 600px;">
                      请导入主结构节点关系~
                    </div>
                  </el-card>
                </el-row>
              </div>
              <el-row type="flex" style="margin-top: 20px;" justify="end">
                <el-col v-if="stepActive===1" :span="6">
                  <el-button-group>
                    <el-button :loading="fileuploading" type="primary" plain icon="el-icon-upload" @click="fileupload">
                      上传
                    </el-button>
                    <el-button :loading="computeLoading" type="info" plain icon="el-icon-d-arrow-right" @click="goStep2">
                      下一步
                    </el-button>
                  </el-button-group>
                </el-col>
                <el-col v-if="stepActive===2" :span="4">
                  <el-button type="primary" icon="el-icon-d-arrow-right" plain @click="goStep3">
                    下一步
                  </el-button>
                </el-col>
                <el-col v-if="stepActive===3" :span="4">
                  <el-button type="success" icon="el-icon-upload" @click="goStep4">
                    图谱
                  </el-button>
                </el-col>
                <el-col v-if="stepActive===4" :span="4">
                  <el-button type="info" icon="el-icon-refresh" plain @click="goRefresh">
                    首页
                  </el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { knowledgeService, readXLSX, XLSX2Tabel, result2echartTree } from '@/api/resource/knowledge'
import { NEO4J_HOST } from '../../../config/config'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from 'neo4jd3'
import * as echarts from 'echarts'

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
      stepActive: 4,
      // step 1
      fileuploading: false,
      mainStrloading: false,
      computeLoading: false,
      ModuleFileData: [], // 文件上传数据（多文件合一）
      ModuleFileList: [],
      BOMFileData: [], // 文件上传数据（多文件合一）
      BOMFileList: [],
      CorrelationFileData: [], // 文件上传数据（多文件合一）
      CorrelationFileList: [],
      evalFileData: [], // 文件上传数据（多文件合一）
      evalFileList: [],
      BOMFile: '',
      moduleFile: '',
      CorrelationFile: '',
      evalFile: '',
      inputTabelListBOM: [],
      inputTabelListModule: [],
      inputTabelListCorrelation: [],
      inputTabelListEval: [],
      genNum: 1,
      reuseNum: 1,
      indivNum: 0,
      // step 2
      resList: [],
      // step 3
      inputSheetNum: 'Sheet1',
      outputTabelList: [],
      // step 4
      nodeFileData: [], // 文件上传数据（多文件合一）
      nodeFileList: [],
      relFileData: [], // 文件上传数据（多文件合一）
      relFileList: [],
      nodeLoading: false,
      relLoading: false,
      graphLoading: false,
      nodeUpload: true,
      relUpload: false,
      showRadio: 'graph',
      tree: {},
      treeInitData: '',
      treeTrunkNode: '',
      treeTrunkTmp: '',
      treeShow: false,
      mainStrStr: []
    }
  },
  watch: {
    showRadio() {
      switch (this.showRadio) {
        case 'graph': { break }
        case 'tree': {
          if (this.nodeFileList.length > 0 && this.relFileList.length > 0 && this.treeShow === true) {
            var count = 0
            this.graphLoading = true
            this.nodeFileList.forEach(file => {
              this.mainStrStr.forEach(item => {
                if (file.name.includes(item)) {
                  count += 1
                  this.echartTree(item)
                }
              })
            })
            if (count === 0) {
              this.showRadio = 'graph'
              this.graphLoading = false
              this.$notify({
                message: '请上传步骤2下载的节点关系文件~',
                type: 'warning',
                duration: 5000
              })
            }
          } else {
            this.showRadio = 'graph'
            this.$notify({
              message: '请上传节点关系文件~',
              type: 'warning',
              duration: 5000
            })
          }
          break
        }
        default: { break }
      }
    }
  },
  mounted() {
    // console.log('mainSearch > category', this.category)
    this.deleteDB()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    // 步骤1
    deleteDB() {
      const _this = this
      _this.$confirm('此操作将永久清空数据库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const labelArr = []
        const params = {
          labelArr: JSON.stringify(labelArr)
        }
        knowledgeService.deleteDB(params).then(res => {
          var data = res.data.data
          console.log('delete::', data)
        }, err => {
          console.error('初始化失败：', err)
          _this.$notify({
            message: '初始化失败~',
            type: 'error',
            duration: 10000
          })
        })
        _this.$message({
          type: 'success',
          message: '初始化成功!'
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    toTemplate(params) {
      window.open(NEO4J_HOST + '/file/download?' + params, '_self')
    },
    // 主结构文件上传
    uploadChangeBOM(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.BOMFileList = fileList
      // 用于预览文件
      this.inputfileBOM = file
    },
    uploadChangeModule(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.ModuleFileList = fileList
      // 用于预览文件
      this.inputfileModule = file
    },
    uploadChangeCorrelation(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.CorrelationFileList = fileList
      // 用于预览文件
      this.inputfileCorrelation = file
    },
    uploadChangeEval(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.evalFileList = fileList
      // 用于预览文件
      this.inputfileEval = file
    },
    uploadFileCorrelation(file) {
      this.CorrelationFileData.append('files', file.file) // append增加数据
    },
    uploadFileEval(file) {
      this.evalFileData.append('files', file.file) // append增加数据
    },
    uploadFileBOM(file) {
      this.BOMFileData.append('files', file.file) // append增加数据
    },
    uploadFileModule(file) {
      this.ModuleFileData.append('files', file.file) // append增加数据
    },
    fileupload() {
      const _this = this
      _this.fileuploading = true
      if (_this.BOMFileData !== [] && _this.ModuleFileData !== [] && _this.CorrelationFileData !== [] && _this.evalFileData !== []) {
        // BOM 原始文件
        _this.BOMFileData = new FormData() // 对应后台inputFile1
        _this.BOMFileData.append('folder', 'mainStructure') // append增加文件夹到后台mainStructure
        _this.$refs.uploadBOM.submit()
        console.log('this.BOMFileData:::', _this.BOMFileData.get('files'))
        // 模板 文件
        _this.ModuleFileData = new FormData() // 对应后台inputFile2
        _this.ModuleFileData.append('folder', 'mainStructure') // append增加文件夹到后台mainStructure
        _this.$refs.uploadModule.submit()
        console.log('this.ModuleFileData:::', _this.ModuleFileData.get('files'))
        // 模板BOM 文件
        _this.CorrelationFileData = new FormData() // 对应后台inputFile3
        _this.CorrelationFileData.append('folder', 'mainStructure') // append增加文件夹到后台mainStructure下
        _this.$refs.uploadCorrelation.submit()
        console.log('this.CorrelationFileData:::', _this.CorrelationFileData.get('files'))
        // 评价指标 文件
        _this.evalFileData = new FormData() // 对应后台inputFile3
        _this.evalFileData.append('folder', 'mainStructure') // append增加文件夹到后台mainStructure下
        _this.$refs.uploadEval.submit()
        console.log('this.evalFileData:::', _this.evalFileData.get('files'))

        // 需求导入图谱
        knowledgeService.fileUploading(_this.BOMFileData).then(res => {
        // console.log('请求成功:', res)
          res.data.forEach(file => {
            // 需要手动配置后端的绝对路径
            _this.BOMFile = file
            console.log('load BOMFile', _this.BOMFile)
            _this.$notify({
              message: '原始BOM上传完成~',
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
              message: '模板上传完成~',
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
                message: '模板BOM上传完成~',
                type: 'success',
                duration: 5000
              })
              // 需求图谱补全
              knowledgeService.fileUploading(_this.evalFileData).then(res => {
                // console.log('请求成功:', res)
                res.data.forEach(file => {
                  // 需要手动配置后端的绝对路径
                  _this.evalFile = file
                  console.log('load evalFile', _this.evalFile)
                })
                _this.$notify({
                  message: '指标文件上传完成~',
                  type: 'success',
                  duration: 5000
                })
                _this.fileuploading = false
              }, err => {
                console.error('指标文件上传失败：', err)
                _this.$notify({
                  message: '指标文件上传失败~',
                  type: 'error',
                  duration: 10000
                })
                _this.fileuploading = false
              })
            }, err => {
              console.error('模板BOM上传失败：', err)
              _this.$notify({
                message: '模板BOM上传失败~',
                type: 'error',
                duration: 10000
              })
              _this.fileuploading = false
            })
          }, err => {
            console.error('模板上传失败：', err)
            _this.$notify({
              message: '模板上传失败~',
              type: 'error',
              duration: 10000
            })
            _this.fileuploading = false
          })
        }, err => {
          console.error('原始BOM上传失败：', err)
          _this.$notify({
            message: '原始BOM上传失败~',
            type: 'error',
            duration: 2000
          })
          _this.fileuploading = false
        })
      }
    },
    async goStep2() {
      if (this.BOMFile === '' || this.moduleFile === '' || this.CorrelationFile === '' || this.evalFile === '') {
        return this.$notify({
          message: '请上传文件~',
          type: 'warning',
          duration: 6000
        })
      } else {
        this.computeLoading = true
        var resultBOM = await readXLSX(this.inputfileBOM) // 读取到的内容
        console.log('XLSXresult::', resultBOM) // 此处为xlsx文件内容
        this.inputTabelListBOM = XLSX2Tabel(resultBOM, this.inputSheetNum)
        console.log('this.inputTabelListBOM::', this.inputTabelListBOM)

        var resultModule = await readXLSX(this.inputfileModule) // 读取到的内容
        console.log('XLSXresult::', resultModule) // 此处为xlsx文件内容
        this.inputTabelListModule = XLSX2Tabel(resultModule, this.inputSheetNum)
        console.log('this.inputTabelListModule::', this.inputTabelListModule)

        var resultCorrelation = await readXLSX(this.inputfileCorrelation) // 读取到的内容
        console.log('XLSXresult::', resultCorrelation) // 此处为xlsx文件内容
        this.inputTabelListCorrelation = XLSX2Tabel(resultCorrelation, this.inputSheetNum)
        console.log('this.inputTabelListCorrelation::', this.inputTabelListCorrelation)

        var resultEval = await readXLSX(this.inputfileEval) // 读取到的内容
        console.log('XLSXresult::', resultEval) // 此处为xlsx文件内容
        this.inputTabelListEval = XLSX2Tabel(resultEval, this.inputSheetNum)
        console.log('this.inputTabelListEval::', this.inputTabelListEval)
        this.computeLoading = false
        if (this.inputTabelListBOM.length !== 0 && this.inputTabelListModule.length !== 0 && this.inputTabelListCorrelation.length !== 0 && this.inputTabelListEval.length !== 0) {
          this.stepActive = 2
        } else {
          this.$notify({
            message: '请检查文件~',
            type: 'error',
            duration: 6000
          })
        }
      }
    },
    // 步骤2
    mainStrGen() {
      const _this = this
      _this.computeLoading = true
      var params = {
        inputFile1: _this.BOMFile,
        inputFile2: _this.moduleFile,
        inputFile3: _this.CorrelationFile,
        inputFile4: _this.evalFile,
        genNum: _this.genNum,
        reuseNum: _this.reuseNum,
        indivNum: _this.indivNum
      }
      knowledgeService.mainStructure(params).then(res => {
        console.log('请求成功:', res)
        _this.bomCsvdownloadUrl = NEO4J_HOST + res.data.bomCsvdownloadUrl
        _this.mainStrCsvdownloadUrl = NEO4J_HOST + res.data.mainStrCsvdownloadUrl
        _this.BOMUrl = NEO4J_HOST + res.data.BOMUrl
        _this.allFamilyEvalUrl = NEO4J_HOST + res.data.allFamilyEvalUrl
        _this.allApproachEvalUrl = NEO4J_HOST + res.data.allApproachEvalUrl
        _this.bestFamilyEvalUrl = NEO4J_HOST + res.data.bestFamilyEvalUrl
        // windows: \r\n; linux: \n
        _this.mainStrStr = res.data.data.split('\r\n').slice(0, -1)
        _this.$notify({
          message: '生成完毕~',
          type: 'success',
          duration: 5000
        })
        _this.computeLoading = false
      }, err => {
        console.error('求解失败：', err)
        _this.$notify({
          message: '求解失败~',
          type: 'error',
          duration: 2000
        })
        _this.computeLoading = false
      })
    },
    downloadRes() {
      if (this.bomCsvdownloadUrl) {
        window.open(this.bomCsvdownloadUrl, 'a')
        window.open(this.mainStrCsvdownloadUrl, 'b')
        window.open(this.BOMUrl, 'c')
        window.open(this.allFamilyEvalUrl, 'd')
        window.open(this.allApproachEvalUrl, 'e')
        window.open(this.bestFamilyEvalUrl, 'f')
      } else {
        this.$notify({
          message: '请求解~',
          type: 'warning',
          duration: 2000
        })
      }
    },
    async uploadResChange(file, fileList) {
      // 预览

      // console.log('file', file)
      this.resLoading = true
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.resList = fileList
      // 用于预览文件
      this.outputfile = file
      console.log('this.outputfile', this.outputfile)
      var result = await readXLSX(this.outputfile) // 读取到的内容
      console.log('XLSXresult::', result) // 此处为xlsx文件内容
      this.outputTabelList = XLSX2Tabel(result, this.inputSheetNum)
      console.log('this.outputTabelList::', this.outputTabelList)
      this.resLoading = false
    },
    goStep3() {
      // console.log(this.resData)
      if (this.outputTabelList.length !== 0) {
        this.stepActive = 3
      } else {
        return this.$notify({
          message: '请选取结果文件~',
          type: 'warning',
          duration: 6000
        })
      }
    },
    // 步骤3

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
      console.log('this.nodeFileList::', this.nodeFileList)
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
      _this.showRadio = 'graph'
      // eslint-disable-next-line no-unused-vars
      var count = 0
      var checkMainStrFile = 1
      _this.nodeFileList.forEach(file => {
        _this.mainStrStr.forEach(item => {
          if (file.name.includes(item)) {
            checkMainStrFile += 1
          }
        })
      })
      if (_this.nodeFileData !== [] && checkMainStrFile > 0) {
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
              const data = res.data.data
              console.log('patent > onSubmit > 检索结果', data)
              for (var n in data.nodes) {
                data.nodes[n].id = data.nodes[n].identity.low
              }
              for (var r in data.relationships) {
                data.relationships[r].id = data.relationships[r].identity.low
              }
              count += 1
              console.log('datadata', data)
              // 图谱需求submit
              window.neo4jd3.resetWithNeo4jData(data)
              _this.$notify({
                message: '节点导入完成~',
                type: 'success',
                duration: 5000
              })
              // if (_this.nodeFileList.length === count) {
              _this.nodeLoading = false
              _this.graphLoading = false
              _this.nodeUpload = false
              _this.relUpload = true
              // }
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
      } else {
        _this.nodeLoading = false
        _this.graphLoading = false
        if (checkMainStrFile === 0) {
          _this.$notify({
            message: '请上传主结构节点文件~',
            type: 'warning',
            duration: 2000
          })
        }
      }
    },
    onUploadRel() {
      const _this = this
      _this.relLoading = true
      _this.graphLoading = true
      // eslint-disable-next-line no-unused-vars
      var count = 0
      var checkMainStrFile = 1
      _this.relFileList.forEach(file => {
        _this.mainStrStr.forEach(item => {
          if (file.name.includes(item)) {
            checkMainStrFile += 1
          }
        })
      })
      if (_this.relFileData !== [] & checkMainStrFile > 0) {
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
              count += 1
              // 图谱需求submit
              window.neo4jd3.resetWithNeo4jData(data)
              _this.$notify({
                message: '关系导入完成~',
                type: 'success',
                duration: 5000
              })
              // if (_this.relFileList.length === count) {
              _this.treeShow = true
              _this.relLoading = false
              _this.graphLoading = false
              _this.nodeUpload = true
              _this.relUpload = false
              // }
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
      } else {
        _this.relLoading = false
        _this.graphLoading = false
        if (checkMainStrFile === 0) {
          _this.$notify({
            message: '请上传主结构关系文件~',
            type: 'warning',
            duration: 2000
          })
        } else {
          _this.$notify({
            message: '请上传关系文件~',
            type: 'warning',
            duration: 2000
          })
        }
      }
    },
    // 主结构树展示
    echartTree(fileName) {
      const _this = this
      const data = {
        label: '主结构',
        name: fileName,
        skip: 0,
        limit: 10
      }
      var params = {
        data: JSON.stringify(data)
      }
      console.log('树请求参数params:', JSON.stringify(params))
      knowledgeService.queryKgInterface(params).then(res => {
        const data = res.data.data
        console.log('patent > onSubmit > 检索结果', data)
        if (data.nodes.length > 0) {
          for (var n in data.nodes) {
            data.nodes[n].id = data.nodes[n].identity.low
          }
          for (var r in data.relationships) {
            data.relationships[r].id = data.relationships[r].identity.low
          }
          if (!_this.treeInitData) {
            _this.treeInitData = data
          } else {
            // eslint-disable-next-line no-redeclare
            for (var n in data.nodes) {
              _this.treeInitData.nodes.push(data.nodes[n])
            }
            // eslint-disable-next-line no-redeclare
            for (var r in data.relationships) {
              _this.treeInitData.relationships.push(data.relationships[r])
            }
          }
          console.log('_this.treeInitData', _this.treeInitData)
          _this.echartTreeInit()
        } else {
          _this.graphLoading = false
          _this.$notify({
            message: '无法找到相关产品，请适当修改或者删减产品特性~',
            type: 'error',
            duration: 6000
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
    echartTreeInit() {
      const _this = this
      result2echartTree(_this.treeInitData, 'mainStructure')
      _this.tree = JSON.parse(JSON.stringify(window.echartTree))
      var myChart = echarts.init(document.getElementById('echartTree'))
      // myChart.showLoading('default', { text: '统计中，请稍候...', maskColor: '#404a59', textColor: '#fff' })
      myChart.clear()
      myChart.hideLoading()
      setTimeout(() => {
        myChart.setOption(_this.option = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            position: 'top',
            formatter: function(params, ticket, callback) {
              _this.treeTrunkTmp = params.name
              return params.value
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {}
            }
          },
          series: [
            {
              type: 'tree',

              data: [window.echartTree],

              top: '5%',
              left: '7%',
              bottom: '2%',
              right: '6%',

              symbolSize: 7,

              // edgeShape: 'polyline',
              // orient: 'vertical',
              roam: true, // 鼠标
              labelLayout: {
                hideOverlap: true
              },

              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right'
              },

              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },
              emphasis: {
                focus: 'ancestor'
              },

              itemStyle: {
                color: 'lightsteelblue', // rgba(180, 0, 0, 1)
                borderColor: '#c23531',
                borderWidth: 1.5
              },
              lineStyle: {
                color: 'rgba(135, 135, 135, 1)',
                width: 1.5,
                curveness: 0.5
              },
              animationEasing: 'linear',

              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        })
        _this.graphLoading = false
      }, 100)
      setTimeout(() => {
        myChart.on('dblclick', function(params) {
          console.log('echart dblclick node::', params)
          _this.params = params
          _this.loading = true
          var data = {
            clickName: params.name,
            fnInit: false,
            skip: 0,
            limit: 100
          }
          var params1 = {
            data: JSON.stringify(data)
          }
          console.log('图谱请求参数dbclick：', params1)
          knowledgeService.productConfigurationTree(params1).then(res => {
            const data = res.data.data
            console.log('patent > onSubmit > 检索结果', data)
            for (var n in data.nodes) {
              data.nodes[n].id = data.nodes[n].identity.low
            }
            for (var r in data.relationships) {
              data.relationships[r].id = data.relationships[r].identity.low
            }
            if (data.nodes.length === 0) {
              _this.$notify({
                message: '到底了~',
                type: 'warning',
                duration: 2000
              })
            } else {
              // 判断双击节点层级
              if (_this.params.data.label === '主结构' || _this.params.data.label === '整机') {
                _this.treeTrunkNode = _this.treeTrunkTmp
              }
              result2echartTree(data, 'mainStructure', _this.treeTrunkNode)
              // 清空产品、主结构的叶子结点
              _this.tree.children[0].children.forEach(node => {
                if (node.name !== _this.treeTrunkNode) {
                  node.children = []
                }
              })
              // 点击扩展树
              var expandTree = _this.objRecurrent([_this.tree], _this.params.name)
              console.log('expandTree::', expandTree)
              _this.tree = JSON.parse(JSON.stringify(expandTree))
              _this.echartReset()
            }
          })
          _this.loading = false
        }, err => {
          console.error('请求失败：', err)
          _this.loading = false
          _this.$notify({
            message: '请求失败~',
            type: 'error',
            duration: 2000
          })
        })
      }, 10)
    },
    objRecurrent(tree, prop) {
      const _this = this
      // console.log('treetreetree', tree)
      for (var item of tree) {
        // console.log('itemitemitemitem', item)
        // console.log('propproppropprop', prop)
        if (item.name !== prop && item.children.length > 0) {
          _this.objRecurrent(item.children, prop)
        } else if (item.name === prop) {
          // window.echartTree.children.forEach(child => {
          //   item.children.push(child)
          // })
          item.children = []
          item.children = window.echartTree.children
        }
      }
      // _this.tree = tree[0]
      return tree[0]
    },
    echartReset() {
      const _this = this
      var myChart = echarts.init(document.getElementById('echartTree'))
      // myChart.showLoading()
      myChart.clear()
      myChart.hideLoading()
      setTimeout(() => {
        myChart.setOption(_this.option = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            position: 'top',
            formatter: function(params, ticket, callback) {
              _this.treeTrunkTmp = params.name
              return params.value
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {},
              dataView: {
                readOnly: false
              }
            }
          },
          series: [
            {
              type: 'tree',

              data: [_this.tree],

              top: '5%',
              left: '7%',
              bottom: '2%',
              right: '6%',

              symbolSize: 7,

              // edgeShape: 'polyline',
              // orient: 'vertical',
              roam: true, // 鼠标
              labelLayout: {
                hideOverlap: true
              }, // 隐藏覆盖
              initialTreeDepth: -1, // 展开

              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right'
                // width: 100,
                // overflow: 'truncate'
              },

              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },
              emphasis: {
                focus: 'ancestor'
              },

              itemStyle: {
                color: 'lightsteelblue',
                borderColor: '#c23531',
                borderWidth: 1.5
              },
              lineStyle: {
                color: 'rgba(135, 135, 135, 1)',
                width: 1.5,
                curveness: 0.5
              },
              animationEasing: 'linear',

              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        })
      }, 100)
    },

    goStep4() {
      this.stepActive = 4
      this.init()
    },
    goBack() {
      if (this.stepActive > 0) {
        this.stepActive -= 1
      } else {
        this.$notify({
          message: '到头啦~',
          type: 'error',
          duration: 2000
        })
      }
    },
    goRefresh() {
      // eslint-disable-next-line no-sequences
      this.stepActive = 1,
      this.nodeUpload = true,
      this.relUpload = false,
      this.treeShow = false,
      this.showRadio = 'graph'
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
    width: 200px;
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
