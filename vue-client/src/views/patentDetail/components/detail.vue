<template>
  <el-card shadow="never" style="display: flex;flex-direction: column;">
    <el-row>
      <el-col :span="18">
        <div style="display:flex;flex-direction: row;justify-content: center;align-items: center; height: 48px;line-height: 48px;font-size: 20px;color:#427DC9;font-weight: bold;">{{ scope.row.properties.name?scope.row.properties.name:scope.row.properties.title }}</div>
        <div v-show="detailData.properties.publicNum" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">公开号</span>
          <span> {{ detailData.properties.publicNum }}</span>
        </div>
        <div v-show="detailData.properties.applyNum?detailData.properties.applyNum:detailData.properties.reqno" class="detail-item">
          <span class="detail-item-label">申请号</span>
          <span> {{ detailData.properties.applyNum?detailData.properties.applyNum:detailData.properties.reqno }}</span>
        </div>
        <div v-show="detailData.properties.author?detailData.properties.author:detailData.properties.inventroName" class="detail-item">
          <span class="detail-item-label">发明人</span>
          <span> {{ detailData.properties.inventroName }}</span>
        </div>
        <div v-show="detailData.properties.applyPersonName" class="detail-item">
          <span class="detail-item-label">申请（专利权）人</span>
          <span> {{ detailData.properties.applyPersonName }}</span>
        </div>
        <div v-show="detailData.properties.applyPersonAddr" class="detail-item">
          <span class="detail-item-label">地址</span>
          <span> {{ detailData.properties.applyPersonAddr }}</span>
        </div>
        <div v-show="detailData.properties.agencyName" class="detail-item">
          <span class="detail-item-label">代理机构</span>
          <span> {{ detailData.properties.agencyName }}</span>
        </div>
        <div v-show="detailData.properties.agentName" class="detail-item">
          <span class="detail-item-label">代理人</span>
          <span> {{ detailData.properties.agentName }}</span>
        </div>
        <div v-show="detailData.properties.publicDate" class="detail-item">
          <span class="detail-item-label">公开日期</span>
          <span> {{ String(detailData.properties.publicDate).slice(0,4) + '-' + String(detailData.properties.publicDate).slice(4,6) + '-' + String(detailData.properties.publicDate).slice(6,8) }}</span>
        </div>
        <div v-show="detailData.properties.applyDate" class="detail-item">
          <span class="detail-item-label">申请日期</span>
          <span> {{ String(detailData.properties.applyDate).slice(0,4) + '-' + String(detailData.properties.applyDate).slice(4,6) + '-' + String(detailData.properties.applyDate).slice(6,8) }}</span>
        </div>
        <div v-show="detailData.properties.expireDate" class="detail-item">
          <span class="detail-item-label">作废日期</span>
          <span> {{ String(detailData.properties.expireDate).slice(0,4) + '-' + String(detailData.properties.expireDate).slice(4,6) + '-' + String(detailData.properties.expireDate).slice(6,8) }}</span>
        </div>
        <div style="margin-top:20px;"/>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" style="display: flex;flex-direction: column;">
          <el-image :src="imgsrc">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <div style="padding: 14px;">
            <span class="title">{{ detailData.properties.inventroName ? detailData.properties.inventroName : detailData.properties.patentName }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ new Date() }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-button v-show="detailData.properties.applyNum" type="warning" plain size="mini" @click="toFullText">阅读全文</el-button>
      <el-button v-show="detailData.properties.publicNum" type="success" plain size="mini" @click="toZJUText">浙大图书馆专利</el-button>
      <el-button v-show="detailData.properties.applyNum" type="info" plain size="mini" @click="toKYText">专利拍卖（科易网）</el-button>
      <el-button v-show="!detailData.properties.applyNum && !detailData.properties.publicNum" type="warning" plain size="mini" @click="toFullText">求助全文</el-button>
      <el-button :loading="linkResourceLoading" type="warning" plain size="mini" @click="linkResource">添加到我的资源</el-button>
    </el-row>
    <el-row>
      <el-card shadow="hover" style="display: flex;flex-direction: column; background-color: #F8F8FF; margin-top:20px;">
        <el-row>
          <span class="text">专利售价：</span>
          <span class="title">￥面议</span>
        </el-row>
        <el-row style="margin-top:20px;">
          <span class="text">支付方式：</span>
          <el-image :src="require('@/static/img/pay.jpg')">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <el-row style="margin-top:20px;">
            <el-button v-show="detailData.properties.publicNum || detailData.properties.applyNum" type="warning" plain icon="el-icon-shopping-cart-2" @click="toPayLink">立即购买</el-button>
          </el-row>
        </el-row>
      </el-card>
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
      linkResourceLoading: false,
      imgsrc: require('@/static/img/chilun.jpg')
    }
  },
  computed: {
  },
  mounted() {
    this.imgPath(this.detailData)
  },
  methods: {
    imgPath(patt) {
      this.imgsrc = require('@/static/img/fmPatent.jpg')
      // console.log('imgPath > path', this.detailData._source.patt)
      // switch (patt) {
      //   case '发明专利': { this.imgsrc = require('@/static/img/fmPatent.jpg'); break }
      //   case '实用新型': { this.imgsrc = require('@/static/img/syxxPatent.jpg'); break }
      //   case '外观设计': { this.imgsrc = require('@/static/img/wgsjPatent.jpg'); break }
      //   default: { this.imgsrc = require('@/static/img/paper.svg'); break }
      // }
    },
    toPayLink() {
      window.open(this.detailData.properties.publicNum ? 'http://oss.wanfangdata.com.cn/Fulltext/Download?fileId=patent_' + this.detailData.properties.publicNum : 'http://oss.wanfangdata.com.cn/Fulltext/Download?fileId=patent_' + this.detailData.properties.applyNum, '_blank')
    },
    toFullText() {
      if (this.detailData.properties.applyNum) {
        window.open('http://d.wanfangdata.com.cn/patent/' + this.detailData.properties.applyNum, '_blank')
      }
    },
    toZJUText() {
      console.log('ZJU链接:', this.detailData)
      if (this.detailData.properties.publicNum) {
        // eslint-disable-next-line
        window.open('https://worldwide.espacenet.com/publicationDetails/originalDocument?CC=CN&NR=' + this.detailData.properties.publicNum.slice(2, ) + '&KC=A&FT=D&ND=&date=' + String(this.detailData.properties.publicDate).replace(/\-/g, '') + '&DB=EPODOC&locale=', '_blank')
      }
    },
    toKYText() {
      if (this.detailData.properties.applyNum) {
        // eslint-disable-next-line
        window.open('https://www.1633.com/patent/list.html?keyword=' + this.detailData.properties.applyNum.slice(2, ), '_blank')
      }
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
    getWFLinkType() {
      switch (this.detailData._index) {
        case 'wf_mds_chn_qikan': {
          return 'periodical'
        }
        case 'wf_mds_chn_huiyi': {
          return 'conference'
        }
        case 'wf_mds_en_huiyi': {
          return 'conference'
        }
        case 'wf_mds_chn_cstad': {
          return 'cstad'
        }
        case 'wf_mds_chn_claw': {
          return 'claw'
        }
        case 'wf_mds_chn_biaozhun': {
          return 'standard'
        }
        case 'wf_mds_chn_zhuanli': {
          return 'patent'
        }
        case 'wf_mds_en_zhuanli': {
          return 'patent'
        }
        case 'f_mds_chn_xuewei': {
          return 'thesis'
        }
        default: {
          return 'patent'
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
</style>
