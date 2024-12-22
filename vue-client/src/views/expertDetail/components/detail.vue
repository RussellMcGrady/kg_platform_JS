<template>
  <el-card shadow="never" style="display: flex;flex-direction: column;">
    <el-row>
      <el-col :span="16">
        <div style="display:flex;flex-direction: row;justify-content: center;align-items: center; height: 48px;line-height: 48px;font-size: 20px;color:#427DC9;font-weight: bold;">{{ detailData.properties.personName.split(';').slice(-1)[0]?detailData.properties.personName.split(';').slice(-1)[0]:detailData.properties.name }}</div>
        <div v-show="detailData.properties.urbanCluster" style="display:flex;flex-direction: row;justify-content: center;align-items: center; height: 48px;line-height: 48px;font-size: 16px;"> {{ detailData.properties.urbanCluster? detailData.properties.urbanCluster:'' }}</div>
        <div v-show="detailData.properties.unitName" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">所属单位</span>
          <span> {{ detailData.properties.unitName }}</span>
        </div>
        <div v-show="detailData.properties.org" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">所属单位</span>
          <span> {{ detailData.properties.org }}</span>
        </div>
        <div v-show="detailData.properties.address" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">所在地</span>
          <span> {{ detailData.properties.address }}</span>
        </div>
        <div v-show="detailData.properties.resume" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">职位</span>
          <span> {{ detailData.properties.resume?detailData.properties.resume:'' }}</span>
        </div>
        <div v-show="detailData.properties['行政职务']" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">行政职务</span>
          <span> {{ detailData.properties['行政职务']?detailData.properties['行政职务']:'' }}</span>
        </div>
        <div v-show="detailData.properties.professionName" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">职称</span>
          <span> {{ detailData.properties.professionName?detailData.properties.professionName:'' }}</span>
        </div>
        <div v-show="detailData.properties.researchField" class="detail-item">
          <span class="detail-item-label">研究领域</span>
          <span> {{ detailData.properties.researchField }}</span>
        </div>
        <div v-show="detailData.properties.researchDirection" class="detail-item">
          <span class="detail-item-label">研究领域</span>
          <span> {{ detailData.properties.researchDirection }}</span>
        </div>
        <div v-show="detailData.properties.class" class="detail-item">
          <span class="detail-item-label">研究方向</span>
          <span> {{ detailData.properties.class?detailData.properties.class:'' }}</span>
        </div>
        <div v-show="detailData.properties.class_1" class="detail-item">
          <span class="detail-item-label">主研方向</span>
          <span> {{ detailData.properties.class_1?detailData.properties.class_1:'' }}</span>
        </div>
        <div v-show="detailData.properties.focus" class="detail-item">
          <span class="detail-item-label">专研领域</span>
          <span> {{ detailData.properties.focus?detailData.properties.focus:'' }}</span>
        </div>
        <div v-show="detailData.properties.honor" class="detail-item">
          <span class="detail-item-label">荣誉</span>
          <span> {{ detailData.properties.honor?detailData.properties.honor:'' }}</span>
        </div>
        <div v-show="detailData.properties.book" class="detail-item">
          <span class="detail-item-label">著作</span>
          <span> {{ detailData.properties.book?detailData.properties.book:'' }}</span>
        </div>
        <div v-show="detailData.properties.summary" class="detail-item">
          <span class="detail-item-label">摘要</span>
          <span> {{ detailData.properties.summary?detailData.properties.summary:'' }}</span>
        </div>
        <div v-show="detailData.properties.baseInfo" class="detail-item">
          <span class="detail-item-label">基本信息</span>
          <span> {{ detailData.properties.baseInfo?detailData.properties.baseInfo:'' }}</span>
        </div>
        <div v-show="detailData.properties.phoneNum" class="detail-item">
          <span class="detail-item-label">联系电话</span>
          <span> {{ detailData.properties.phoneNum?detailData.properties.phoneNum:'' }}</span>
        </div>
        <div v-show="detailData.properties['技术领域']" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">技术领域</span>
          <span> {{ detailData.properties['技术领域']?detailData.properties['技术领域']:'' }}</span>
        </div>
        <div v-show="detailData.properties['专家类型']" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">专家类型</span>
          <span> {{ detailData.properties['专家类型']?detailData.properties['专家类型']:'' }}</span>
        </div>
        <div v-show="detailData.properties['专家组']" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">专家组</span>
          <span> {{ detailData.properties['专家组']?detailData.properties['专家组']:'' }}</span>
        </div>
        <div v-show="detailData.properties.baseInfo" class="detail-item">
          <span class="detail-item-label">基本信息</span>
          <span> {{ detailData.properties.baseInfo?detailData.properties.baseInfo:'' }}</span>
        </div>
        <div v-show="detailData.properties.province" class="detail-item">
          <span class="detail-item-label">省</span>
          <span> {{ detailData.properties.province }}</span>
        </div>
        <div v-show="detailData.properties.city" class="detail-item">
          <span class="detail-item-label">市</span>
          <span> {{ detailData.properties.city }}</span>
        </div>
        <div v-show="detailData.properties.id" class="detail-item">
          <span class="detail-item-label">万方 ID</span>
          <span> {{ detailData.properties.id }}</span>
        </div>
        <div style="margin-top:20px;"/>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" style="display: flex;flex-direction: column;">
          <img src="@/static/img/person.svg" class="image">
          <div style="padding: 14px;">
            <span>{{ detailData.properties.personName.split(';').slice(-1)[0]?detailData.properties.personName.split(';').slice(-1)[0]:detailData.properties.name }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ new Date() }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-button v-show="detailData.properties.name" type="warning" plain size="mini" @click="toFullText">联系专家</el-button>
      <el-button v-show="!detailData.properties.name" type="warning" plain size="mini" @click="toFullText">求助专家</el-button>
      <el-button :loading="linkResourceLoading" type="warning" plain size="mini" @click="linkResource">添加到我的资源</el-button>
    </el-row>
  </el-card>
</template>

<script>
import { knowledgeService } from '@/api/resource/knowledge'

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
      linkResourceLoading: false
    }
  },
  computed: {
  },
  methods: {
    toFullText() {
      window.open('http://d.wanfangdata.com.cn/periodical/' + this.detailData.properties.name, '_blank')
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
