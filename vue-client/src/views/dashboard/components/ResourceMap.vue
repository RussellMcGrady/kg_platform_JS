<template>
  <div>
    <div v-loading="mapLoading" id="dashMap" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="height:600px;" />
  </div>
</template>

<style>
  html,body,#app{
    height: 100%;
  }
</style>

<script>
import { knowledgeService } from '@/api/resource/knowledge'
import * as echarts from 'echarts'
import { result2ChinaMap } from '@/api/resource/knowledge'
// eslint-disable-next-line no-unused-vars
import bmap from 'echarts/extension/bmap/bmap.js'
import 'echarts/map/js/china.js'

// import BMap from 'BMap'

export default {
  name: 'App',
  components: {
  },
  props: {
    resourceType: {
      type: String,
      default: () => ''
    },
    sliderActive: {
      type: Number,
      default: () => ''
    }
  },
  data() {
    return {
      table: false,
      patentListMap: [],
      patentList: [],
      patentListNb: [],
      countmapTable: 0,
      activeIndex: 1,
      category: 'all',
      content: this.$route.query.content || '',
      sortField: '',
      listLoading: false,
      searchResult: [],
      count: 0,
      pageNumber: 1,
      pageSize: 20,
      searchRadio: 'list',
      resourceTypeData: '',
      nodeColor: '',
      mapLoading: false
    }
  },
  watch: {
    resourceType() {
      this.handleSearch()
    },
    sliderActive() {
      this.onSearchMap()
    }
  },
  mounted() {
    // this.init()
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      switch (this.resourceType) {
        case '专利': { this.resourceTypeData = '专利'; this.onSearchMap(); break }
        case '高新技术企业': { this.resourceTypeData = '高新技术企业'; this.onSearchMap(); break }
        case '服务机构': { this.resourceTypeData = '代理机构'; this.onSearchMap(); break }
        case '专家': { this.resourceTypeData = '专家'; this.onSearchMap(); break }
        case '供应商': { this.resourceTypeData = '供应商'; this.onSearchMap(); break }
        default: { this.resourceTypeData = '代理机构'; this.onSearchMap(); break }
      }
    },
    /**
     * 监听子组件检索词变化，重新检索
     * */
    async onSearchMap() {
      // 专利图谱
      const _this = this
      _this.mapLoading = true
      // 地图
      window.H = {
        label: _this.resourceTypeData,
        name: '',
        skip: 0,
        limit: 1000 * _this.sliderActive
      }
      var params2 = {
        data: JSON.stringify(window.H)
      }
      console.log('地图检索参数', params2)
      await knowledgeService.queryKgInterface(params2).then(res => {
        const data = res.data.data
        console.log('patent > onSubmit > 检索结果', data)
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        console.log('datadata', data)
        window.map = data
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
      // 地图
      result2ChinaMap(window.map)
      // var data2 = window.mapChinaData
      var myGeoChart = echarts.init(document.getElementById('dashMap'))
      myGeoChart.hideLoading()
      // echarts.registerMap('China', China)
      myGeoChart.setOption(this.option = {
        title: {
          text: _this.resourceTypeData + '资源',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 0,
          max: 50,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: _this.resourceTypeData + '地图',
            type: 'map',
            map: 'china',
            data: window.mapChinaData,
            label: {
              show: true
            }
          }
        ]
      })
      // map click
      myGeoChart.on('click', async function(params) {
        const route = _this.getClickRoute()
        _this.$goRoute({ name: route })
      })
      _this.mapLoading = false
    },
    getSearchGraphTypeParam() {
      switch (this.category) {
        case 'all': {
          return '专利'
        }
        case 'qikan': {
          return '期刊'
        }
        case 'chn_huiyi': {
          return '会议'
        }
        case 'en_huiyi': {
          return '会议'
        }
        case 'chengguo': {
          return '成果'
        }
        case 'fagui': {
          return '法规'
        }
        case 'standard': {
          return '标准'
        }
        case 'chn_patent': {
          return '专利'
        }
        case 'en_patent': {
          return '专利'
        }
        case 'yinwen': {
          return '引文'
        }
        case 'author': {
          return '学者'
        }
        default: {
          return '专利'
        }
      }
    },
    getClickRoute() {
      switch (this.resourceTypeData) {
        case '专利': {
          return 'paper'
        }
        case '代理机构': {
          return 'serviceOrginization'
        }
        case '高新技术企业': {
          return 'techCompany'
        }
        case '专家': {
          return 'expert'
        }
        case '供应商': {
          return 'supplier'
        }
        default: {
          return 'paper'
        }
      }
    }
  }
}
</script>
<style scoped>
  .my-dashboard-container{
    padding: 20px 60px;
    background-color: rgb(240, 242, 245);
  }
  .my-app{
    background-color: rgb(238, 238, 238);
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }
  .right-module{
    margin-top: 10px;
  }
  ::v-deep .anchorBL{
    display:none
  }
</style>
