<template>
  <el-card shadow="never" style="display: flex;flex-direction: column;">
    <el-row>
      <el-col :span="16">
        <div style="display:flex;flex-direction: row;justify-content: center;align-items: center; height: 48px;line-height: 48px;font-size: 20px;color:#427DC9;font-weight: bold;">{{ detailData.properties.agencyName?detailData.properties.agencyName:detailData.properties.name }}</div>
        <div v-show="detailData.properties.urbanCluster" style="display:flex;flex-direction: row;justify-content: center;align-items: center; height: 48px;line-height: 48px;font-size: 16px;"> {{ detailData.properties.urbanCluster? detailData.properties.urbanCluster:'' }}</div>
        <div v-show="detailData.properties.agencyCod" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">机构代码</span>
          <span> {{ detailData.properties.agencyCod?detailData.properties.agencyCod:'' }}</span>
        </div>
        <div v-show="detailData.properties.agencystate" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">机构状态</span>
          <span> {{ detailData.properties.agencystate?detailData.properties.agencystate:'' }}</span>
        </div>
        <div v-show="detailData.properties.unitAddress" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">地址</span>
          <span> {{ detailData.properties.unitAddress?detailData.properties.unitAddress:'' }}</span>
        </div>
        <div v-show="detailData.properties.email" class="detail-item">
          <span class="detail-item-label">email</span>
          <span> {{ detailData.properties.email?detailData.properties.email:'' }}</span>
        </div>
        <div v-show="detailData.properties.phoneNum?detailData.properties.phoneNum:detailData.properties.phone" class="detail-item">
          <span class="detail-item-label">联系电话</span>
          <span> {{ detailData.properties.phoneNum?detailData.properties.phoneNum:detailData.properties.phone }}</span>
        </div>
        <div v-show="detailData.properties.fax" class="detail-item">
          <span class="detail-item-label">传真</span>
          <span> {{ detailData.properties.fax?detailData.properties.fax:'' }}</span>
        </div>
        <div v-show="detailData.properties.legalPerson" class="detail-item">
          <span class="detail-item-label">法人</span>
          <span> {{ detailData.properties.legalPerson?detailData.properties.legalPerson:'' }}</span>
        </div>
        <div v-show="detailData.properties.shareholders" class="detail-item">
          <span class="detail-item-label">股东</span>
          <span> {{ detailData.properties.shareholders?detailData.properties.shareholders:'' }}</span>
        </div>
        <div v-show="detailData.properties.agent" class="detail-item">
          <span class="detail-item-label">代理人</span>
          <span> {{ detailData.properties.agent?detailData.properties.agent:'' }}</span>
        </div>
        <div style="margin-top:20px;"/>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" style="display: flex;flex-direction: column;">
          <img src="@/static/img/service.svg" class="image">
          <div style="padding: 14px;">
            <span>{{ detailData.properties.agencyName?detailData.properties.agencyName:detailData.properties.name }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ new Date() }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-button v-show="detailData.properties.name" type="warning" plain size="mini" @click="toFullText">查看服务商</el-button>
      <el-button v-show="!detailData.properties.name" type="warning" plain size="mini" @click="toFullText">联系服务商</el-button>
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
