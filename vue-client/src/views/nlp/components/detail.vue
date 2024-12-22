<template>
  <el-card shadow="never" style="display: flex;flex-direction: column;">
    <el-row>
      <el-col :span="16">
        <div style="display:flex;flex-direction: row;justify-content: center;align-items: center; height: 48px;line-height: 48px;font-size: 20px;color:#427DC9;font-weight: bold;">{{ detailData.properties.name?detailData.properties.name:detailData.properties.name }}</div>
        <div v-show="detailData.properties.address" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">地址</span>
          <span> {{ detailData.properties.address?detailData.properties.address:'' }}</span>
        </div>
        <div v-show="detailData.properties.begin_time" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">启动建设时间</span>
          <span> {{ detailData.properties.begin_time?detailData.properties.begin_time:'' }}</span>
        </div>
        <div v-show="detailData.properties.pass_time" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">验收通过时间</span>
          <span> {{ detailData.properties.pass_time?detailData.properties.pass_time:'' }}</span>
        </div>
        <div v-show="detailData.properties.dept" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">主管部门</span>
          <span> {{ detailData.properties.dept?detailData.properties.dept:'' }}</span>
        </div>
        <div v-show="detailData.properties.sup_unit" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">依托单位</span>
          <span> {{ detailData.properties.sup_unit?detailData.properties.sup_unit:'' }}</span>
        </div>
        <div v-show="detailData.properties.descript" class="detail-item">
          <span class="detail-item-label">简介</span>
          <span> {{ detailData.properties.descript?detailData.properties.descript:'' }}</span>
        </div>
        <div v-show="detailData.properties.en_name" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">英文名</span>
          <span> {{ detailData.properties.en_name?detailData.properties.en_name:'' }}</span>
        </div>
        <div v-show="detailData.properties.fee" class="detail-item">
          <span class="detail-item-label">投入经费</span>
          <span> {{ detailData.properties.fee?detailData.properties.fee:'' }}</span>
        </div>
        <div v-show="detailData.properties.field" class="detail-item">
          <span class="detail-item-label">领域</span>
          <span> {{ detailData.properties.field?detailData.properties.field:'' }}</span>
        </div>
        <!-- <div v-show="detailData.properties.id" class="detail-item">
          <span class="detail-item-label">id</span>
          <span> {{ detailData.properties.id?detailData.properties.id:'' }}</span>
        </div> -->
        <div v-show="detailData.properties.pass_dept" class="detail-item">
          <span class="detail-item-label">批复部门</span>
          <span> {{ detailData.properties.pass_dept?detailData.properties.pass_dept:'' }}</span>
        </div>
        <div v-show="detailData.properties.type" class="detail-item">
          <span class="detail-item-label">设备类型</span>
          <span> {{ detailData.properties.type?detailData.properties.type:'' }}</span>
        </div>
        <div style="margin-top:20px;"/>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" style="display: flex;flex-direction: column;">
          <!-- <img src="@/static/img/supplier.svg" class="image"> -->
          <el-image :src="require('@/assets/device/' + detailData.properties.id + '.jpg')" :preview-src-list="[require('@/assets/device/' + detailData.properties.id + '.jpg')]" lazy>
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <div style="padding: 14px;">
            <span>{{ detailData.properties.sup_name?detailData.properties.sup_name:detailData.properties.name }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ new Date() }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <!-- Form -->
      <el-button type="danger" plain round style="margin-bottom:20px;" @click="dialogFormVisible = true">我要预约</el-button>
      <el-dialog :visible.sync="dialogFormVisible" title="填写信息直接预约">
        <el-form :inline="true" :model="form">
          <el-form-item :label-width="formLabelWidth" label="姓名">
            <el-input v-model="form.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="电话">
            <el-input v-model="form.phone" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="邮箱">
            <el-input v-model="form.email" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="地址">
            <el-input v-model="form.address" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="单位">
            <el-input v-model="form.org" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="研究领域">
            <el-input v-model="form.researchField" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="项目">
            <el-input v-model="form.project" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="预约时间">
            <el-col :span="11">
              <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;"/>
            </el-col>
            <el-col :span="2" class="line">-</el-col>
            <el-col :span="11">
              <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;"/>
            </el-col>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="需求描述">
            <el-input v-model="form.demand" type="textarea" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="danger" @click="dialogFormVisible = false; formOnSubmit()">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
    <el-row style="margin-bottom:5px;" >
      <el-button v-show="detailData.properties.sup_unit" type="warning" plain size="mini" @click="toGraphVis(detailData.properties.sup_unit.replace(/\s*/g, ''))">查看依托单位</el-button>
      <el-button v-show="detailData.properties.sup_unit" type="warning" plain size="mini" @click="toGraphPatent(detailData.properties.sup_unit.replace(/\s*/g, ''))">关联专利</el-button>
      <el-button v-show="detailData.properties.name" type="warning" disabled plain size="mini" @click="toGraphVis(detailData.properties.sup_unitsup_unit.replace(/\s*/g, ''))">关联论文</el-button>
      <el-button v-show="detailData.properties.tel || detailData.properties.email" type="warning" plain size="mini" @click="toFullText">联系依托单位</el-button>
      <el-button :loading="linkResourceLoading" type="warning" plain size="mini" @click="linkResource">添加到我的资源</el-button>
    </el-row>
    <el-row>
      <el-input-number v-model="inputNum" size="mini" label="关联数量" @change="handleChange"/>
      <el-card v-loading="loading" v-show="graphDis" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div id="neo4jd3Id" class style="height: 600px;">暂无数据~</div>
      </el-card>
    </el-row>
  </el-card>
</template>

<script>
import { knowledgeService } from '@/api/resource/knowledge'
import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'

export default {
  name: 'Person',
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      linkResourceLoading: false,
      graphDis: false,
      loading: false,
      inputNum: 1,
      name: '',
      dialogFormVisible: false,
      form: {
        name: '',
        phone: '',
        email: '',
        address: '',
        org: '',
        researchField: '',
        project: '',
        demand: '',
        date1: '',
        date2: ''
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
  },
  methods: {
    toFullText() {
      window.open('http://d.wanfangdata.com.cn/periodical/' + this.detailData.properties.name, '_blank')
    },
    toGraphVis(name) {
      this.graphDis = true
      this.name = name
      this.init(this.name)
    },
    async toGraphPatent(name) {
      this.graphDis = true
      this.loading = true
      this.name = name
      await this.onSearch('wf_mds_chn_zhuanli,wf_mds_en_zhuanli', this.name)
    },
    linkResource() {
      const _this = this
      this.linkResourceLoading = true
      console.log('待关联的资源:', this.detailData)
      const parentNode = {
        label: '用户',
        id: localStorage.getItem('id'),
        name: localStorage.getItem('name'),
        company_id: localStorage.getItem('company_id'),
        company_name: localStorage.getItem('company_name')
      }
      const relationLabel = this.getLinkType()[0]
      console.log('关联资源类型：', relationLabel)
      const relation = {
        label: relationLabel
      }
      var nodeLabel = this.getLinkType()[1]
      const childNode = {
        label: nodeLabel,
        _id: this.detailData._id,
        _source: this.detailData._source
      }
      var params = {
        H: JSON.stringify(parentNode),
        R: JSON.stringify(relation),
        T: JSON.stringify(childNode)
      }
      console.log('params:', params)
      knowledgeService.wfKjResource2kg(params).then(res => {
        console.log('关联资源结果', res)
        if (res.data.code === 20000) {
          _this.linkResourceLoading = false
          _this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 3000
          })
        } else {
          _this.linkResourceLoading = false
          _this.$notify({
            message: '添加失败',
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    getLinkType() {
      switch (this.detailData._index) {
        case 'wf_mds_chn_qikan': {
          return ['关联资源_期刊', '期刊']
        }
        case 'wf_mds_chn_huiyi': {
          return ['关联资源_会议', '会议']
        }
        case 'wf_mds_en_huiyi': {
          return ['关联资源_会议', '会议']
        }
        case 'wf_mds_chn_cstad': {
          return ['关联资源_成果', '成果']
        }
        case 'wf_mds_chn_claw': {
          return ['关联资源_法规', '法规']
        }
        case 'wf_mds_chn_biaozhun': {
          return ['关联资源_标准', '标准']
        }
        case 'wf_mds_chn_zhuanli': {
          return ['关联资源_专利', '专利']
        }
        case 'wf_mds_en_zhuanli': {
          return ['关联资源_专利', '专利']
        }
        case 'wf_mds_chn_yinwen': {
          return ['关联资源_引文', '引文']
        }
        case 'wf_mds_auth_new': {
          return ['关联资源_作者', '作者']
        }
        default: {
          return ['关联资源_期刊', '期刊']
        }
      }
    },
    init(name) {
      const H = {
        label: '单位',
        name: name
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
    },
    onSearch(searchIndex, name) {
      const _this = this
      // indexName 需要改成传参形式
      console.log('关联的企业：', name)
      var params1 = {
        indexName: searchIndex,
        queryString: name,
        sortField: '',
        fields: '',
        pageNumber: 0,
        pagePerNo: this.inputNum,
        facets: ''
      }
      console.log('检索内容：', params1)
      knowledgeService.queryWf(params1).then(async res => {
        console.log('res:', res)
        // 加入知识图谱
        await this.getSaveKgTypeParam(res, 'zhuanli').then(async res => {
          // setTimeout(async() => await this.init(name), 1)
          this.loading = false
          await this.onSubmit2(name)
        })
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
        // _this.listLoading = false
      })
    },
    async onSubmit2(name) {
      // 专利图谱
      const _this = this
      // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
      const H = {
        label: '单位',
        name: name,
        skip: 0,
        limit: this.inputNum
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
    // 加入知识图谱
    getSaveKgTypeParam(res, category) {
      switch (category) {
        case 'all': {
          return '无需加入'
        }
        case 'zhuanli': {
          console.log('res::', res)
          return knowledgeService.wfPatent2kg(res).then(res => {
            console.log('已加入资源图谱~')
          })
        }
        case 'qikan': {
          console.log('res::', res)
          return knowledgeService.wfPaper2kg(res).then(res => {
            console.log('已加入资源图谱~')
          })
        }
        case 'huiyi': {
          console.log('res::', res)
          return knowledgeService.wfMeeting2kg(res).then(res => {
            console.log('已加入资源图谱~')
          })
        }
        case 'chengguo': {
          return '成果'
        }
        case 'fagui': {
          return '法规'
        }
        case 'standard': {
          console.log('res::', res)
          return knowledgeService.wfStandard2kg(res).then(res => {
            console.log('已加入资源图谱~')
          })
        }
        case 'yinwen': {
          return knowledgeService.wfRef2kg(res).then(res => {
            console.log('已加入资源图谱~')
          })
        }
        case 'author': {
          return '学者'
        }
        default: {
          return '无需加入'
        }
      }
    },
    async handleChange(value) {
      console.log('changeValue::', value)
    },
    formOnSubmit() {
      this.$message({
        type: 'success',
        message: '已提交~'
      })
    }
  }
}
</script>

<style scoped>
  .card-title{
    font-size: 16px;
    font-weight: bold;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .detail-item span{
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    float: top;
  }
  .detail-item-label{
    width:100px;
    font-weight: bold;
    margin-right: 20px;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .image {
    width: 100%;
    display: block;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
