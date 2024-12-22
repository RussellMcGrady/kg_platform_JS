<template>
  <div class="my-dashboard-container">
    <el-container>
      <el-header style="height: 40px;line-height: 40px;font-size: 16px;">
        <span>当前位置 专利资源</span>
      </el-header>
      <el-container>
        <!-- <el-aside width="200px">
          <side-bar-category :current-category="category" @onUpdateCategory="onUpdateCategory"/>
        </el-aside>-->
        <el-main style="padding:0 20px 20px 20px;">
          <el-card>
            <el-row>
              <el-col :span="18">
                <div style="display: flex;flex-direction: row;">
                  <head-menu :content="content" style="width: 400px;" @onUpdateSearch="onUpdateSearch" @onUpdateContent="onUpdateContent" />
                  <el-radio-group v-model="searchRadio" style="height:36px;line-height: 36px;margin-left: 40px;padding: 4px;">
                    <el-radio label="graph">
                      图谱
                    </el-radio>
                    <el-radio label="map">
                      地图
                    </el-radio>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="30" style="margin-top: 5px">
                <el-radio-group v-if="searchRadio==='graph' || searchRadio==='map'" v-model="radioActive" size="mini" style="margin-top: 20px;">
                  <el-radio label="">
                    全部
                  </el-radio>
                  <el-radio label="长三角城市群" />
                  <el-radio label="成渝城市群" />
                  <el-radio label="京津冀城市群" />
                  <el-radio label="哈长城市群" />
                </el-radio-group>
              </el-col>
            </el-row>
          </el-card>
          <!-- <el-card>
            <head-menu :content="content" @onUpdateSearch="onUpdateSearch" @onUpdateContent="onUpdateContent"/>
          </el-card>
          <el-card shadow="never">
            <el-radio-group v-model="searchRadio">
              <el-radio label="list">列表</el-radio>
              <el-radio label="graph">图谱</el-radio>
              <el-radio label="map">地图</el-radio>
            </el-radio-group>
          </el-card>-->
          <search-result v-if="searchRadio==='list'" :list-loading="listLoading" :search-result="searchResult" :count="count" />
          <el-pagination
            v-show="searchRadio==='list' && count>0"
            :pager-count="9"
            :total="count"
            :page-size="20"
            background
            layout="prev, pager, next"
            @current-change="pageChange"
          />
          <div v-show="searchRadio==='analysis'">
            <el-card v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <el-row type="flex" style="margin-top: 20px;line-height:60px;font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="left">
                <span>共计：{{ resCount }} 篇专利</span>
              </el-row>
              <div id="echartSquareTree" style="height: 600px;">
                暂无数据~
              </div>
              <!-- <el-input
                v-model="filterText"
                placeholder="输入关键字进行过滤"/> -->
              <!-- <el-tree
                ref="tree"
                :data="resAnalysis"
                :props="defaultProps"
                :filter-node-method="filterNode"
                class="filter-tree"
                default-expand-all/> -->
            </el-card>
          </div>

          <!-- <pagination
            v-show="searchRadio==='list' && count>0"
            :total="count"
            :page.sync="pageNumber"
            :limit.sync="pageSize"
            @pagination="onSearch"/> -->
          <div v-show="searchRadio==='graph'">
            <card style="background-color: grey">
              <div id="neo4jd3Id" class style="height: 600px;">
                暂无数据~
              </div>
            </card>
          </div>
          <div v-show="searchRadio==='map'">
            <el-row>
              <el-col :span="16">
                <div class="block">
                  <el-slider
                    v-model="sliderActive"
                    :step="1"
                    :min="1"
                    :max="1000"
                    show-stops
                    @change="sliderChange"
                  />
                  <!-- <span class="demonstration" style="font-size: 10px; margin-right: 0px;">散点图标大小</span> -->
                </div>
              </el-col>
            </el-row>
            <el-row v-loading="mapLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <div id="paperMap" style="height:600px;">
                暂无数据~
              </div>
            </el-row>
          </div>
        </el-main>
        <!--<el-aside width="300px">
          <paper-recommend/>
        &lt;!&ndash;<expert-recommend class="right-module"/>
        <service-recommend class="right-module"/>&ndash;&gt;
        </el-aside>-->
      </el-container>
    </el-container>
    <el-drawer
      id="mapDrawer"
      :visible.sync="table"
      title="城市群专利详情"
      direction="rtl"
      size="50%"
    >
      <el-pagination
        :pager-count="9"
        :total="countmapTable"
        :page-size="10"
        background
        layout="prev, pager, next"
        @current-change="current_changeMapDrawer"
      />
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="patentListMap"
        :row_style="{height: '40px'}"
        :cell-style="{height: '40px'}"
        tooltip-effect="dark"
        content="Top center"
        placement="top"
        max-height="1200"
        element-loading-text="Loading"
        border
        height="500"
        highlight-current-row
      >
        <el-table-column align="center" type="index" label="序号" width="95" />
        <el-table-column label="名称" align="left" prop="title" width="300">
          <template slot-scope="scope">
            <span type="text" style="color: #215DA9" @click="toPatentDetail(scope.row)">{{ scope.row.properties.name?scope.row.properties.name:scope.row.properties.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市群" align="center" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.properties.urbanCluster }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import HeadMenu from './components/Header'
import { knowledgeService, city2Urban } from '@/api/resource/knowledge'
import SearchResult from './components/SearchResult'
// import SideBarCategory from './components/SideBarCategory'
// import PaperRecommend from './components/PaperRecommend'
// import ExpertRecommend from './components/ExpertRecommend'
// import ServiceRecommend from './components/ServiceRecommend'
// import Pagination from '@/components/Pagination'
import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'
import * as echarts from 'echarts'
import { result2map } from '@/api/resource/knowledge'
// eslint-disable-next-line no-unused-vars
import bmap from 'echarts/extension/bmap/bmap.js'
import BMap from 'BMap'

export default {
  name: 'App',
  components: {
    HeadMenu,
    SearchResult
    // SideBarCategory,
    // PaperRecommend,
    // ExpertRecommend,
    // ServiceRecommend,
    // Pagination
  },
  data() {
    return {
      table: false,
      patentListMap: [],
      // patentList: [],
      // patentListNb: [],
      countmapTable: 0,
      activeIndex: 1,
      category: '',
      content: this.$route.query.content || '',
      sortField: '',
      listLoading: false,
      searchResult: [],
      count: 0,
      pageNumber: 1,
      pageNumberMap: 1,
      pageSize: 20,
      searchRadio: 'graph',
      radioActive: '',
      switchActive: false,
      sliderActive: 1,
      mapLoading: false,
      resCount: '',
      resAnalysis: [],
      loading: false,
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    searchRadio() {
      switch (this.searchRadio) {
        case 'list': { this.pageNumber = 1; this.onSearch(); break }
        case 'graph': { this.onSubmit2(); break }
        case 'map': { this.onSearchMap(); break }
        case 'analysis': { this.onSubmit4(); break }
        default: { this.pageNumber = 1; this.onSubmit2(); break }
      }
    },
    radioActive() {
      if (this.searchRadio === 'graph') {
        switch (this.radioActive) {
          case '': { this.onSubmit2(); break }
          case '长三角城市群': { this.onSubmit2(); break }
          case '成渝城市群': { this.onSubmit2(); break }
          case '京津冀城市群': { this.onSubmit2(); break }
          case '哈长城市群': { this.onSubmit2(); break }
          default: { this.onSubmit2(); break }
        }
      } else if (this.searchRadio === 'map') {
        if (this.switchActive === false) {
          switch (this.radioActive) {
            case '': { this.onSearchMap(); break }
            case '长三角城市群': { this.onSearchMap(); break }
            case '成渝城市群': { this.onSearchMap(); break }
            case '京津冀城市群': { this.onSearchMap(); break }
            case '哈长城市群': { this.onSearchMap(); break }
            default: { this.onSearchMap(); break }
          }
        } else {
          this.switchActive = false
          this.switchChange()
          switch (this.radioActive) {
            case '': { this.onSearchMap(); break }
            case '长三角城市群': { this.onSearchMap(); break }
            case '成渝城市群': { this.onSearchMap(); break }
            case '京津冀城市群': { this.onSearchMap(); break }
            case '哈长城市群': { this.onSearchMap(); break }
            default: { this.onSearchMap(); break }
          }
        }
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    console.log('mainSearch > init')
    this.init()
    if (this.content !== '') {
      this.onSubmit2()
    }
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    openUrban(urban) {
      this.$confirm('是否要查看当前城市群资源?', '提示', {
        confirmButtonText: '查看',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const _this = this
        this.$message({
          type: 'success',
          message: '城市群资源~'
        })
        _this.table = true
        _this.unitName = ''
        await _this.onSubmit3()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消查询'
        })
      })
    },
    onUpdateSearch(content) {
      this.content = content
      if (this.category === 'all') {
        if (this.searchRadio === 'list') {
          this.onSearch()
        } else {
          this.$message({
            type: 'warning',
            message: '“全部”不支持图谱和地图搜索，请切换至城市群'
          })
        }
        this.onSearch()
      } else {
        if (this.searchRadio === 'list') {
          this.onSearch()
        } else if (this.searchRadio === 'graph') {
          this.onSubmit2()
        } else if (this.searchRadio === 'analysis') {
          this.onSubmit4()
        } else {
          if (this.switchActive === false) {
            this.onSearchMap()
          } else {
            this.onSearchMap()
            this.switchActive = false
            this.switchChange()
          }
        }
      }
    },
    // onUpdateCategory(category) {
    //   this.category = category
    //   this.onSearch()
    // },
    onUpdateContent(content) {
      this.content = content
    },
    pageChange(currentPage) {
      this.pageNumber = currentPage
      if (this.category === 'all') {
        console.log('this.pageNumber:', this.pageNumber)
        this.onSearch()
      } else {
        if (this.searchRadio === 'list') {
          this.onSearch()
        } else if (this.searchRadio === 'map') {
          this.onSubmit3()
        }
      }
    },
    onSearch() {
      this.searchResult = []
      const _this = this
      this.listLoading = true
      // indexName 需要改成传参形式
      var searchIndex = 'wf_mds_chn_zhuanli,wf_mds_en_zhuanli'
      console.log('检索类别：', searchIndex)
      var params1 = {
        PatentName: this.content,
        PageIndex: Number(this.pageNumber)
      }
      console.log('检索内容：', params1)
      knowledgeService.queryNbPatent(params1).then(async res => {
        if (!res.data || res.data === '') {
          _this.searchResult = []
          _this.count = 0
          _this.listLoading = false
          return
        }
        _this.res = JSON.parse(res.data)
        console.log('信息院专利：', _this.res)
        _this.count = JSON.parse(_this.res).totalItemCount
        _this.res = JSON.parse(_this.res).data
        _this.wrapRes = []
        _this.res.forEach(element => {
          var wrapProp = {}
          wrapProp['properties'] = element
          _this.wrapRes.push(wrapProp)
        })
        console.log('wrapRes:', _this.wrapRes)
        _this.searchResult = _this.wrapRes
        console.log('res:', _this.searchResult)
        _this.listLoading = false

        // 加入知识图谱
        knowledgeService.nbPatent2kg(res).then(res => {
          console.log('已加入资源图谱~')
        })
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
        _this.listLoading = false
      })
    },
    async onSubmit2() {
      // 专利图谱
      const _this = this
      // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
      // const label = this.getSearchGraphTypeParam()
      const H = {
        label: '专利',
        name: this.content,
        urbanCluster: this.radioActive,
        skip: 0,
        limit: 20
      }
      // 用于可视化图谱
      var params1 = {
        data: JSON.stringify(H)
      }
      console.log('图谱请求参数：', params1)
      await knowledgeService.queryEntity(params1).then(res => {
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
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    async onSearchMap() {
      // 专利图谱
      const _this = this
      // const label = this.getSearchGraphTypeParam()
      // 地图
      window.H = {
        label: '专利',
        name: this.content,
        urbanCluster: this.radioActive,
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
      result2map(window.map)
      // console.log(window.mapData)
      var data2 = window.mapData
      var geoCoordMap = {
        '海门': [121.15, 31.89],
        '鄂尔多斯': [109.781327, 39.608266],
        '招远': [120.38, 37.35],
        '舟山': [122.207216, 29.985295],
        '齐齐哈尔': [123.97, 47.33],
        '盐城': [120.13, 33.38],
        '赤峰': [118.87, 42.28],
        '青岛': [120.33, 36.07],
        '乳山': [121.52, 36.89],
        '金昌': [102.188043, 38.520089],
        '泉州': [118.58, 24.93],
        '莱西': [120.53, 36.86],
        '日照': [119.46, 35.42],
        '胶南': [119.97, 35.88],
        '南通': [121.05, 32.08],
        '拉萨': [91.11, 29.97],
        '云浮': [112.02, 22.93],
        '梅州': [116.1, 24.55],
        '文登': [122.05, 37.2],
        '上海': [121.48, 31.22],
        '攀枝花': [101.718637, 26.582347],
        '威海': [122.1, 37.5],
        '承德': [117.93, 40.97],
        '厦门': [118.1, 24.46],
        '汕尾': [115.375279, 22.786211],
        '潮州': [116.63, 23.68],
        '丹东': [124.37, 40.13],
        '太仓': [121.1, 31.45],
        '曲靖': [103.79, 25.51],
        '烟台': [121.39, 37.52],
        '福州': [119.3, 26.08],
        '瓦房店': [121.979603, 39.627114],
        '即墨': [120.45, 36.38],
        '抚顺': [123.97, 41.97],
        '玉溪': [102.52, 24.35],
        '张家口': [114.87, 40.82],
        '阳泉': [113.57, 37.85],
        '莱州': [119.942327, 37.177017],
        '湖州': [120.1, 30.86],
        '汕头': [116.69, 23.39],
        '昆山': [120.95, 31.39],
        '宁波': [121.56, 29.86],
        '湛江': [110.359377, 21.270708],
        '揭阳': [116.35, 23.55],
        '荣成': [122.41, 37.16],
        '连云港': [119.16, 34.59],
        '葫芦岛': [120.836932, 40.711052],
        '常熟': [120.74, 31.64],
        '东莞': [113.75, 23.04],
        '河源': [114.68, 23.73],
        '淮安': [119.15, 33.5],
        '泰州': [119.9, 32.49],
        '南宁': [108.33, 22.84],
        '营口': [122.18, 40.65],
        '惠州': [114.4, 23.09],
        '江阴': [120.26, 31.91],
        '蓬莱': [120.75, 37.8],
        '韶关': [113.62, 24.84],
        '嘉峪关': [98.289152, 39.77313],
        '广州': [113.23, 23.16],
        '延安': [109.47, 36.6],
        '太原': [112.53, 37.87],
        '清远': [113.01, 23.7],
        '中山': [113.38, 22.52],
        '昆明': [102.73, 25.04],
        '寿光': [118.73, 36.86],
        '盘锦': [122.070714, 41.119997],
        '长治': [113.08, 36.18],
        '深圳': [114.07, 22.62],
        '珠海': [113.52, 22.3],
        '宿迁': [118.3, 33.96],
        '咸阳': [108.72, 34.36],
        '铜川': [109.11, 35.09],
        '平度': [119.97, 36.77],
        '佛山': [113.11, 23.05],
        '海口': [110.35, 20.02],
        '江门': [113.06, 22.61],
        '章丘': [117.53, 36.72],
        '肇庆': [112.44, 23.05],
        '大连': [121.62, 38.92],
        '临汾': [111.5, 36.08],
        '吴江': [120.63, 31.16],
        '石嘴山': [106.39, 39.04],
        '沈阳': [123.38, 41.8],
        '苏州': [120.62, 31.32],
        '茂名': [110.88, 21.68],
        '嘉兴': [120.76, 30.77],
        '长春': [125.35, 43.88],
        '胶州': [120.03336, 36.264622],
        '银川': [106.27, 38.47],
        '张家港': [120.555821, 31.875428],
        '三门峡': [111.19, 34.76],
        '锦州': [121.15, 41.13],
        '南昌': [115.89, 28.68],
        '柳州': [109.4, 24.33],
        '三亚': [109.511909, 18.252847],
        '自贡': [104.778442, 29.33903],
        '吉林': [126.57, 43.87],
        '阳江': [111.95, 21.85],
        '泸州': [105.39, 28.91],
        '西宁': [101.74, 36.56],
        '宜宾': [104.56, 29.77],
        '呼和浩特': [111.65, 40.82],
        '成都': [104.06, 30.67],
        '大同': [113.3, 40.12],
        '镇江': [119.44, 32.2],
        '桂林': [110.28, 25.29],
        '张家界': [110.479191, 29.117096],
        '宜兴': [119.82, 31.36],
        '北海': [109.12, 21.49],
        '西安': [108.95, 34.27],
        '金坛': [119.56, 31.74],
        '东营': [118.49, 37.46],
        '牡丹江': [129.58, 44.6],
        '遵义': [106.9, 27.7],
        '绍兴': [120.58, 30.01],
        '扬州': [119.42, 32.39],
        '常州': [119.95, 31.79],
        '潍坊': [119.1, 36.62],
        '重庆': [106.54, 29.59],
        '台州': [121.420757, 28.656386],
        '南京': [118.78, 32.04],
        '滨州': [118.03, 37.36],
        '贵阳': [106.71, 26.57],
        '无锡': [120.29, 31.59],
        '本溪': [123.73, 41.3],
        '克拉玛依': [84.77, 45.59],
        '渭南': [109.5, 34.52],
        '马鞍山': [118.48, 31.56],
        '宝鸡': [107.15, 34.38],
        '焦作': [113.21, 35.24],
        '句容': [119.16, 31.95],
        '北京': [116.46, 39.92],
        '徐州': [117.2, 34.26],
        '衡水': [115.72, 37.72],
        '包头': [110, 40.58],
        '绵阳': [104.73, 31.48],
        '乌鲁木齐': [87.68, 43.77],
        '枣庄': [117.57, 34.86],
        '杭州': [120.19, 30.26],
        '淄博': [118.05, 36.78],
        '鞍山': [122.85, 41.12],
        '溧阳': [119.48, 31.43],
        '库尔勒': [86.06, 41.68],
        '安阳': [114.35, 36.1],
        '开封': [114.35, 34.79],
        '济南': [117, 36.65],
        '德阳': [104.37, 31.13],
        '温州': [120.65, 28.01],
        '九江': [115.97, 29.71],
        '邯郸': [114.47, 36.6],
        '临安': [119.72, 30.23],
        '兰州': [103.73, 36.03],
        '沧州': [116.83, 38.33],
        '临沂': [118.35, 35.05],
        '南充': [106.110698, 30.837793],
        '天津': [117.2, 39.13],
        '富阳': [119.95, 30.07],
        '泰安': [117.13, 36.18],
        '诸暨': [120.23, 29.71],
        '郑州': [113.65, 34.76],
        '哈尔滨': [126.63, 45.75],
        '聊城': [115.97, 36.45],
        '芜湖': [118.38, 31.33],
        '唐山': [118.02, 39.63],
        '平顶山': [113.29, 33.75],
        '邢台': [114.48, 37.05],
        '德州': [116.29, 37.45],
        '济宁': [116.59, 35.38],
        '荆州': [112.239741, 30.335165],
        '宜昌': [111.3, 30.7],
        '义乌': [120.06, 29.32],
        '丽水': [119.92, 28.45],
        '洛阳': [112.44, 34.7],
        '秦皇岛': [119.57, 39.95],
        '株洲': [113.16, 27.83],
        '石家庄': [114.48, 38.03],
        '莱芜': [117.67, 36.19],
        '常德': [111.69, 29.05],
        '保定': [115.48, 38.85],
        '湘潭': [112.91, 27.87],
        '金华': [119.64, 29.12],
        '岳阳': [113.09, 29.37],
        '长沙': [113, 28.21],
        '衢州': [118.88, 28.97],
        '廊坊': [116.7, 39.53],
        '菏泽': [115.480656, 35.23375],
        '合肥': [117.27, 31.86],
        '武汉': [114.31, 30.52],
        '大庆': [125.03, 46.58]
      }
      var convertData = function(data) {
        var res = []
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name]
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            })
          }
        }
        return res
      }
      var myGeoChart = echarts.init(document.getElementById('paperMap'))
      myGeoChart.hideLoading()
      myGeoChart.setOption(this.option = {
        title: {
          text: '专利资源地图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        bmap: {
          center: [106.323292, 38.408669],
          // zoom: 5,
          roam: true
        },
        series: [
          {
            name: '专利资源',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: convertData(data2),
            symbolSize: function(val) {
              return (Math.log(val[2]) * ((_this.sliderActive / 10) + 1))
            },
            encode: {
              value: 2
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            itemStyle: {
              color: 'red' // #5480ffff
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: convertData(data2.sort(function(a, b) {
              return b.value - a.value
            }).slice(0, 6)),
            symbolSize: function(val) {
              return (Math.log(val[2]) * ((_this.sliderActive / 100) + 1))
            },
            encode: {
              value: 2
            },
            symbol: 'pin',
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              formatter: '{b}',
              position: 'right',
              show: true
            },
            itemStyle: {
              color: '#ff5400cc',
              shadowBlur: 10,
              shadowColor: '#333'
            },
            zlevel: 1
          }
        ]
      })
      // map click
      myGeoChart.on('click', async function(params) {
        city2Urban(params.name)
        _this.title = window.urban
        _this.table = true
        // _this.countmapTable = 0
        // _this.pageNumberMap = 0
        // _this.patentListMap = []
        _this.onSubmit3()
      })

      // 添加百度地图插件
      var map = myGeoChart.getModel().getComponent('bmap').getBMap()
      // eslint-disable-next-line no-undef
      map.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] }))
      map.addControl(new BMap.NavigationControl())
      window.map = map
      // map.enableScrollWheelZoom()
      // map.enableDragging()
      // map.disableDoubleClickZoom()
    },
    // 地图
    async onSubmit3() {
      const _this = this
      _this.listLoading = true
      window.H = {
        label: '专利',
        name: _this.content,
        urbanCluster: _this.title,
        skip: (_this.pageNumberMap - 1) * 10,
        limit: 10
      }
      var params3 = {
        data: JSON.stringify(window.H)
      }
      console.log('细分检索参数：', window.H)
      await knowledgeService.queryKgInterface(params3).then(res => {
        const data = res.data.data
        console.log('res > 检索结果', res)
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        _this.res = data
        _this.countmapTable = res.data.count
        _this.patentListMap = _this.res.nodes
        console.log('_this.patentListMap', _this.patentListMap)
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
    // 万方知识脉络分析
    async onSubmit4() {
      const _this = this
      if (_this.content === '') {
        _this.$notify({
          message: '请输入查询内容',
          type: 'warning',
          duration: 2000
        })
      } else {
      // indexName 需要改成传参形式
        _this.loading = true
        var searchIndex = 'wf_mds_chn_zhuanli,wf_mds_en_zhuanli'
        var params2 = {
          indexName: searchIndex,
          queryString: _this.content
        }
        var params3 = {
          queryString: _this.content,
          size: 10
        }
        // 知识统计
        knowledgeService.queryWfCount(params2).then(async res => {
        // console.log('count res::', res)
          var count = 0
          JSON.parse(JSON.parse(res.data).CountResult).forEach(item => {
            count += Number(item.value)
          })
          _this.resCount = count
          console.log('_this.resCount::', _this.resCount)
        })
        // 知识脉络
        knowledgeService.queryWfAnalysis(params3).then(async res => {
          var resAnalysis = JSON.parse(res.data).KnowledgeTrendAnalysisResult
          resAnalysis = JSON.parse(resAnalysis)
          console.log('analysis res::', resAnalysis)
          var dataSquareTree = []
          // 作者result
          var au = {
            name: '作者',
            value: 0,
            children: []
          }
          for (var i in resAnalysis.au) {
            var auTmp = {
              name: i,
              value: resAnalysis.au[i]
            }
            au.value += resAnalysis.au[i]
            au.children.push(auTmp)
          }
          dataSquareTree.push(au)
          // 关键词result
          var ckey = {
            name: '关联词',
            value: 0,
            children: []
          }
          // eslint-disable-next-line no-redeclare
          for (var i in resAnalysis.ckey) {
            var ckeyTmp = {
              name: i,
              value: resAnalysis.ckey[i]
            }
            ckey.value += resAnalysis.ckey[i]
            ckey.children.push(ckeyTmp)
          }
          dataSquareTree.push(ckey)
          // 期刊result
          var fjoucn = {
            name: '期刊',
            value: 0,
            children: []
          }
          // eslint-disable-next-line no-redeclare
          for (var i in resAnalysis.fjoucn) {
            var fjoucnTmp = {
              name: i,
              value: resAnalysis.fjoucn[i]
            }
            fjoucn.value += resAnalysis.fjoucn[i]
            fjoucn.children.push(fjoucnTmp)
          }
          dataSquareTree.push(fjoucn)
          // 机构result
          var forgc = {
            name: '机构',
            value: 0,
            children: []
          }
          // eslint-disable-next-line no-redeclare
          for (var i in resAnalysis.forgc) {
            var forgcTmp = {
              name: i,
              value: resAnalysis.forgc[i]
            }
            forgc.value += resAnalysis.forgc[i]
            forgc.children.push(forgcTmp)
          }
          dataSquareTree.push(forgc)
          // 年份result
          var year = {
            name: '年份',
            value: 0,
            children: []
          }
          // eslint-disable-next-line no-redeclare
          for (var i in resAnalysis.year) {
            var yearTmp = {
              name: i,
              value: resAnalysis.year[i]
            }
            year.value += resAnalysis.year[i]
            year.children.push(yearTmp)
          }
          dataSquareTree.push(year)
          console.log('dataSquareTree', dataSquareTree)
          // 矩形树
          var formatUtil = echarts.format
          function getLevelOption() {
            return [
              {
                itemStyle: {
                  borderWidth: 0,
                  gapWidth: 5
                }
              },
              {
                itemStyle: {
                  gapWidth: 1
                }
              },
              {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                  gapWidth: 1,
                  borderColorSaturation: 0.6
                }
              }
            ]
          }
          var myChart = echarts.init(document.getElementById('echartSquareTree'))
          // myChart.showLoading('default', { text: '统计中，请稍候...', maskColor: '#404a59', textColor: '#fff' })
          myChart.clear()
          myChart.hideLoading()
          myChart.setOption(_this.option = {
            title: {
              text: '专利分析',
              left: 'center'
            },

            tooltip: {
              formatter: function(info) {
                var value = info.value
                var treePathInfo = info.treePathInfo
                var treePath = []

                for (var i = 1; i < treePathInfo.length; i++) {
                  treePath.push(treePathInfo[i].name)
                }

                return [
                  '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                  '共: ' + formatUtil.addCommas(value) + ' 篇'
                ].join('')
              }
            },

            series: [
              {
                name: '专利分析',
                type: 'treemap',
                visibleMin: 300,
                label: {
                  show: true,
                  formatter: '{b}'
                },
                itemStyle: {
                  borderColor: '#fff'
                },
                levels: getLevelOption(),
                data: dataSquareTree
              }
            ]
          })
          _this.loading = false
        }, err => {
          console.error('请求失败：', err)
          _this.$notify({
            message: '请求失败~',
            type: 'error',
            duration: 2000
          })
          _this.loading = false
        })
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    init() {
      const H = {
        label: '专利'
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
    current_changeMapDrawer(currentPage) {
      console.log(currentPage)
      this.pageNumberMap = currentPage - 1
      this.onSubmit3()
    },
    toPatentDetail(row) {
      console.log('searchResult > toPatentDetail > 选中项：', row)
      this.$goRoute({ name: 'patentDetail', query: { detail: row }})
    },
    // =====获取行政区域边界=====
    getBoundary(urbanCluster, blist, districtLoading) {
      urbanCluster.forEach(urban => {
        this.addDistrict(urban, blist, districtLoading)
      })
    },
    // =====添加行政区域=====
    addDistrict(urban, blist, districtLoading) {
      const _this = this
      // 使用计数器来控制加载过程
      districtLoading++
      var bdary = new BMap.Boundary()
      bdary.get(urban, function(rs) { // 获取行政区域
        var count = rs.boundaries.length // 行政区域的点有多少个
        for (var i = 0; i < count; i++) {
          blist.push({ points: rs.boundaries[i], name: urban })
        }
        // 加载完成区域点后计数器-1
        districtLoading--
        if (districtLoading === 0) {
          // 全加载完成后画端点
          _this.drawBoundary(blist)
          // param.this.openUrban()
        }
      })
    },
    // =====绘制边界=====
    drawBoundary(blist) {
      const _this = this
      // 包含所有区域的点数组
      var pointArray = []
      // alert(blist)
      // 循环添加各闭合区域
      for (var i = 0; i < blist.length; i++) {
        // 添加多边形层并显示
        var ply = new BMap.Polygon(blist[i].points, {
          strokeWeight: 3, // 边框宽度
          trokeColor: '#014F99', // 边框颜色
          fillColor: ' #DDE4F0' // 填充颜色
        }) // 建立多边形覆盖物
        ply.name = blist[i].name
        /*
        =====点击行政区域事件=====
        */
        ply.addEventListener('mouseover', function(ply) {
          // alert(ply.target.name)
          _this.openUrban(ply.target.name)
        })
        window.map.addOverlay(ply)
        // map.addEventListener('click', function(e) {
        //   console.log(e)
        // })

        // 将点增加到视野范围内
        var path = ply.getPath()
        pointArray = pointArray.concat(path)
      }

      // 限定显示区域(只显示特定区域，鼠标拖动松开后自动回到显示范围内)，需要引用api库
      // var boundply = new BMap.Polygon(pointArray);
      // BMapLib.AreaRestriction.setBounds(map, boundply.getBounds());
      // map.setViewport(pointArray) // 调整视野
    },
    switchChange() {
      const _this = this
      console.log('switchActive::', _this.switchActive)
      var blist = []
      var districtLoading = 0
      var urbanCluster = []
      if (_this.switchActive === true) {
        window.mapData.forEach(city => {
          if (city.value !== 0) {
            urbanCluster.push(city.name)
          }
        })
        this.$message({
          type: 'warning',
          message: '加载中，请等待...',
          duration: 6000
        })
        this.mapLoading = true
        this.getBoundary(urbanCluster, blist, districtLoading)
        setTimeout(() => {
          this.$message({
            type: 'success',
            message: '加载完成。',
            duration: 6000
          })
          this.mapLoading = false
        }, 6000)
      } else {
        var overlays = window.map.getOverlays()
        overlays.forEach(overlay => {
          // eslint-disable-next-line no-proto
          if (overlay.__proto__.PQ === 'Polygon') {
            console.log('overlay::', overlay)
            window.map.removeOverlay(overlay)
            // overlay.disableMassClear()
          }
        })
        // window.map.clearOverlays()
      }
      // var urban = '辽宁'
    },
    async sliderChange() {
      const _this = this
      console.log('sliderActive::', _this.sliderActive)
      _this.onSearchMap()
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
  /* .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  } */
</style>
