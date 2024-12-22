<template>
  <div id="app" class="my-app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-main style="padding:0 20px 20px 20px;">
        <el-card shadow="never">
          <el-header width="200px">
            <span>图嵌入与表示学习算法</span>
            <el-radio-group v-model="searchRadio" style="height:36px;line-height: 36px;margin-left: 40px;padding: 4px;">
              <el-radio label="Node2Vec">
                Node2Vec
              </el-radio>
              <el-radio label="graphSage">
                graphSage
              </el-radio>
            </el-radio-group>
          </el-header>
          <!-- <all-comment :detail-data="detailData" class="module"/>
          <my-comment :detail-data="detailData" class="module"/>
          <paper-recommend class="module"/> -->

          <el-row style="margin-left: 60px; margin-top: 10px; margin-bottom: 10px">
            <span>图嵌入（Graph Embedding）</span>
          </el-row>
          <el-row>
            <el-col :span="3" style="margin-left: 60px">
              <el-cascader
                v-model="reknTypeLan"
                :options="knTypeLan"
                placeholder="请选择资源类型"
                clearable
                filterable
                remote
              />
            </el-col>
            <el-col :span="16" style="margin-left: 40px">
              <el-input v-model="contentLan" type="textarea" autosize placeholder="请输入资源特性" />
            </el-col>
            <el-col :span="1" style="margin-left: 40px">
              <el-button type="warning" icon="el-icon-search" @click="onSubmitNode2Vec">
                处理
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <div v-show="searchRadio==='Node2Vec'">
              <el-card v-show="graphDis" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <span>{{ result }}</span>
                <div id="Node2VecMap" style="height:600px; margin-top: 20px">
                  暂无数据~
                </div>
              </el-card>
            </div>
          </el-row>
        </el-card>
      </el-main>
    </div>
  </div>
</template>

<script>
// import HeadMenu from './components/Header'
// import SearchResult from './components/SearchResult'
// import SideBarCategory from './components/SideBarCategory'
// import PaperRecommend from './components/PaperRecommend'
// import ExpertRecommend from './components/ExpertRecommend'
// import ServiceRecommend from './components/ServiceRecommend'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { knowledgeService } from '@/api/resource/knowledge'
import embed from 'vega-embed'

// import * as d3 from 'd3' // secondary package based on el-pagination
// import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'

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
      searchRadio: 'Node2Vec',
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
        case 'words': { this.pageNumber = 1; this.onSearchData(); break }
        case 'graph': { this.onSubmit2(); break }
        case 'map': { this.onSearchMap(); break }
        default: { this.pageNumber = 1; this.onSearchData(); break }
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
    async onSubmitNode2Vec() {
      // 专利图谱
      const _this = this

      // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
      this.loading = true
      var params1 = {
        nodeLabelArray: JSON.stringify(['产品-摄像头', '产品-pcb']),
        relationLabelArray: JSON.stringify(['零部件']),
        hLabel: '产品-摄像头',
        rLabel: '零部件',
        tLabel: '产品-pcb',
        limit: 100
      }
      console.log('图谱请求参数：', params1)
      await knowledgeService.graphEmbeddingNode2Vec(params1).then(async res => {
        var data = res.data
        console.log('patent > onSubmit > 检索结果', data)
        const def = JSON.parse(data.visData)
        console.log('defdefdef', def)
        await embed('#Node2VecMap', def, { actions: false })
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
