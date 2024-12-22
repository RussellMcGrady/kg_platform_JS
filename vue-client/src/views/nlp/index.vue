<template>
  <div id="app" class="my-app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-main style="padding:0 20px 20px 20px;">
        <el-card shadow="never">
          <el-header width="200px">
            <span>自然语言处理与自然语言理解</span>
            <el-radio-group v-model="searchRadio" style="height:36px;line-height: 36px;margin-left: 40px;padding: 4px;">
              <el-radio label="Words Segment">
                分词
              </el-radio>
              <el-radio label="NER">
                命名实体识别
              </el-radio>
              <el-radio label="POS">
                词性标注
              </el-radio>
              <el-radio label="KG">
                知识抽取
              </el-radio>
              <el-radio label="Sentiment">
                情感分析
              </el-radio>
              <el-radio label="NLU">
                语义理解
              </el-radio>
            </el-radio-group>
          </el-header>
          <!-- <all-comment :detail-data="detailData" class="module"/>
          <my-comment :detail-data="detailData" class="module"/>
          <paper-recommend class="module"/> -->

          <el-row style="margin-left: 60px; margin-top: 10px; margin-bottom: 10px">
            <span>{{ searchRadio }}</span>
          </el-row>
          <el-row>
            <el-col :span="3" style="margin-left: 60px">
              <el-cascader
                v-model="reknTypeLan"
                :options="knTypeLan"
                placeholder="请选择语言"
                clearable
                filterable
                remote
              />
            </el-col>
            <el-col :span="16" style="margin-left: 40px">
              <el-input v-model="contentLan" type="textarea" autosize placeholder="请输入文本" />
            </el-col>
            <el-col :span="1" style="margin-left: 40px">
              <el-button type="warning" icon="el-icon-search" @click="onSubmitWords">
                处理
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <div v-show="searchRadio==='Words Segment'" class="divShow">
              <el-card v-show="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <!-- <span class="spanShow">{{ result }}</span> -->
                <div id="wordMap" style="height:600px; margin-top: 20px">
                  请输入文本~
                </div>
              </el-card>
            </div>
            <div v-show="searchRadio==='NER'" class="divShow">
              <el-card v-show="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <span class="spanShow">{{ result }}</span>
              </el-card>
            </div>
            <div v-show="searchRadio==='POS'" class="divShow">
              <el-card v-show="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <span class="spanShow">{{ result }}</span>
              </el-card>
            </div>
            <div v-show="searchRadio==='KG'" class="divShow">
              <el-card v-show="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <span class="spanShow">{{ result }}</span>
              </el-card>
            </div>
            <div v-show="searchRadio==='Sentiment'" class="divShow">
              <el-card v-show="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <span class="spanShow">{{ result }}</span>
              </el-card>
            </div>
            <div v-show="searchRadio==='NLU'">
              <el-card v-show="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <pre style="color: orangered; margin-left: 200px">{{ result }}</pre>
              </el-card>
            </div>
          </el-row>
        </el-card>
      </el-main>
    </div>
  </div>
</template>

<script>
import { knowledgeService, result2echartWordcloud } from '@/api/resource/knowledge'
// import HeadMenu from './components/Header'
// import SearchResult from './components/SearchResult'
// import SideBarCategory from './components/SideBarCategory'
// import PaperRecommend from './components/PaperRecommend'
// import ExpertRecommend from './components/ExpertRecommend'
// import ServiceRecommend from './components/ServiceRecommend'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

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
      graphDis: true,
      loading: false,
      searchRadio: 'Words Segment',
      // 分词语言类型
      reknTypeLan: '',
      knTypeLan: [{
        value: 'zh',
        label: '中文'
      }, {
        value: 'en',
        label: '英文'
      }],
      contentLan: '',
      result: ''
    }
  },
  watch: {
    searchRadio() {
      switch (this.searchRadio) {
        case 'Words Segment': { this.result = ''; break }
        case 'NER': { this.result = ''; break }
        case 'POS': { this.result = ''; break }
        case 'KG': { this.result = ''; break }
        case 'Sentiment': { this.result = ''; break }
        case 'NLU': { this.result = ''; break }
        default: { this.result = ''; break }
      }
    }
  },
  mounted() {
    console.log('mainSearch > category', this.category)
    // this.init()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    async onSubmitWords() {
      // 专利图谱
      const _this = this
      if (this.reknTypeLan === '') {
        _this.$notify({
          message: '请选择语言类型',
          type: 'warning',
          duration: 2000
        })
      } else {
      // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
        this.loading = true

        // CoreNLP 接口
        // var params1 = {
        //   lan: this.reknTypeLan[0],
        //   sent: this.contentLan
        // }
        // console.log('图谱请求参数：', params1)
        // await knowledgeService.words(params1).then(res => {
        //   const data = res.data.data
        //   console.log('patent > onSubmit > 检索结果', data)
        //   this.result = data

        // jiagu 接口
        var params1 = {
          text: this.contentLan
        }
        console.log('图谱请求参数：', params1)
        if (this.searchRadio === 'Words Segment') {
          await knowledgeService.cutExtraction(params1).then(res => {
            const data = res.data.data
            // eslint-disable-next-line no-eval
            console.log('patent > onSubmit > 检索结果', eval(data[0]))
            // eslint-disable-next-line no-eval
            this.result = eval(data[0])
            // eslint-disable-next-line no-eval
            result2echartWordcloud(eval(data[0]))

            // echarts 词云
            var myWordChart = echarts.init(document.getElementById('wordMap'))
            myWordChart.setOption({
              series: [{
                type: 'wordCloud',

                // The shape of the "cloud" to draw. Can be any polar equation represented as a
                // callback function, or a keyword present. Available presents are circle (default),
                // cardioid (apple or heart shape curve, the most known polar equation), diamond (
                // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.
                shape: 'circle',

                // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
                // Default to be put in the center and has 75% x 80% size.
                left: 'center',
                top: 'center',
                width: '70%',
                height: '80%',
                right: null,
                bottom: null,
                // Text size range which the value in data will be mapped to.
                // Default to have minimum 12px and maximum 60px size.
                sizeRange: [12, 60],

                // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
                rotationRange: [0, 0],
                rotationStep: 0,

                // size of the grid in pixels for marking the availability of the canvas
                // the larger the grid size, the bigger the gap between words.
                gridSize: 22,

                // set to true to allow word being draw partly outside of the canvas.
                // Allow word bigger than the size of the canvas to be drawn
                drawOutOfBound: false,

                // If perform layout animation.
                // NOTE disable it will lead to UI blocking when there is lots of words.
                layoutAnimation: true,

                // Global text style
                textStyle: {
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                  // Color can be a callback function or a color string
                  color: function() {
                  // Random color
                    return 'rgb(' + [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160)
                    ].join(',') + ')'
                  },
                  emphasis: {
                    focus: 'self',
                    textStyle: {
                      shadowBlur: 10,
                      shadowColor: '#333'
                    }
                  }
                },
                data: window.echartWordcloud
              }]
            })
            myWordChart.on('dblclick', async function(param) {
              console.log(param.name)
              _this.$notify({
                message: param.name,
                type: 'success',
                duration: 2000
              })
            })
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
        } else if (this.searchRadio === 'NER') {
          await knowledgeService.nerExtraction(params1).then(res => {
            const data = res.data.data
            // eslint-disable-next-line no-eval
            console.log('patent > onSubmit > 检索结果', eval(data[0]))
            // eslint-disable-next-line no-eval
            this.result = eval(data[0])
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
        } else if (this.searchRadio === 'POS') {
          await knowledgeService.posExtraction(params1).then(res => {
            const data = res.data.data
            // eslint-disable-next-line no-eval
            console.log('patent > onSubmit > 检索结果', eval(data[0]))
            // eslint-disable-next-line no-eval
            this.result = eval(data[0])
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
        } else if (this.searchRadio === 'KG') {
          await knowledgeService.kgExtraction(params1).then(res => {
            const data = res.data.data
            // eslint-disable-next-line no-eval
            console.log('patent > onSubmit > 检索结果', eval(data[0])[0])
            // eslint-disable-next-line no-eval
            this.result = eval(data[0])[0]
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
        } else if (this.searchRadio === 'Sentiment') {
          await knowledgeService.sentimentExtraction(params1).then(res => {
            const data = res.data.data
            // eslint-disable-next-line no-eval
            console.log('patent > onSubmit > 检索结果', data[0])
            // eslint-disable-next-line no-eval
            this.result = data[0]
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
        } else if (this.searchRadio === 'NLU') {
          await knowledgeService.nluExtraction(params1).then(res => {
            const data = res.data.data
            // eslint-disable-next-line no-eval
            console.log('patent > onSubmit > 检索结果', data)
            // eslint-disable-next-line no-eval
            this.result = JSON.stringify(data, null, 4)
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
        }
      }
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
            const params = {
              id: node.id
            }
            _this.node = node
            knowledgeService.nodeClick(params).then(res => {
              res = res.data.data
              console.log('点击事件patent:', res)
              for (var n in res.nodes) {
                res.nodes[n].id = res.nodes[n].identity.low
              }
              for (var r in res.relationships) {
                res.relationships[r].id = res.relationships[r].identity.low
              }
              // 高亮点击的节点
              var highlight =
                [{
                  class: _this.node.labels[0],
                  property: 'name',
                  value: _this.node.properties.name
                }]
              window.neo4jd3.resetNeoData(res, highlight)
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
  .divShow  {
    text-align: center;
    font-size: 50px;
    font-weight: 600;
    line-height: 150px;
  }
  .spanShow  {
    color: white;
    text-shadow:
    0px 0px 20px yellow,
    0px 0px 10px orange,
    0px 0px 10px orangered,
    0px 0px 10px red;
  }

</style>
