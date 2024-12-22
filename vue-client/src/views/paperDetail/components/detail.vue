<template>
  <el-card shadow="never" style="display: flex;flex-direction: column;">
    <el-row>
      <el-col :span="18">
        <div style="display:flex;flex-direction: row;justify-content: center;align-items: center; height: 48px;line-height: 48px;font-size: 20px;color:#427DC9;font-weight: bold;">{{ detailData._source.title?detailData._source.title.replace(/%/g,' '):detailData._source.title }}</div>
        <div v-show="detailData._source.author" style="display:flex;flex-direction: row;justify-content: center;align-items: center; height: 48px;line-height: 48px;font-size: 16px;"> {{ detailData._source.author? detailData._source.author.replace(/%/g,' '):detailData._source.author }}</div>
        <div v-show="detailData._source.abstract" class="detail-item" >
          <span style="font-weight: bold;margin-right: 10px;">摘要</span>
          <span> {{ detailData._source.abstract }}</span>
        </div>
        <div v-show="detailData._source.keyword" class="detail-item">
          <span class="detail-item-label">关键词</span>
          <span> {{ detailData._source.keyword?detailData._source.keyword.replace(/%/g,' '):detailData._source.keyword }}</span>
        </div>
        <div v-show="detailData._source.authorinfo" class="detail-item">
          <span class="detail-item-label">作者单位</span>
          <span> {{ detailData._source.authorinfo?detailData._source.authorinfo[0].ORG[0]:'' }}</span>
        </div>
        <div v-show="detailData._source.joucn" class="detail-item">
          <span class="detail-item-label">刊名</span>
          <span> {{ detailData._source.joucn?detailData._source.joucn:'' }}</span>
        </div>
        <div v-show="detailData._source.jouen" class="detail-item">
          <span class="detail-item-label">期刊</span>
          <span> {{ detailData._source.jouen?detailData._source.jouen:'' }}</span>
        </div>
        <div v-show="detailData._source.vol" class="detail-item">
          <span class="detail-item-label">年，卷(期)</span>
          <span> {{ detailData._source.vol }}</span>
        </div>
        <div v-show="detailData._source.mcid" class="detail-item">
          <span class="detail-item-label">分类号</span>
          <span> {{ detailData._source.mcid?detailData._source.mcid.replace(/%/g,' '):detailData._source.mcid }}</span>
        </div>
        <div v-show="detailData._source.date" class="detail-item">
          <span class="detail-item-label">在线出版日期</span>
          <span> {{ detailData._source.date }}</span>
        </div>
        <div v-show=" detailData._source.pn" class="detail-item">
          <span class="detail-item-label">页数</span>
          <span> {{ detailData._source.pn }}</span>
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
            <span class="title">{{ detailData._source.author?detailData._source.author:detailData._source.title }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ new Date() }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-button v-show="detailData._source.wid || detailData._source.patno || detailData._source.reqno" type="warning" plain size="mini" @click="toFullText">阅读全文</el-button>
      <el-button v-show="detailData._source.anno || detailData._source.annodate" type="success" plain size="mini" @click="toZJUText">浙大图书馆专利</el-button>
      <el-button v-show="detailData._source.patno || detailData._source.reqno" type="info" plain size="mini" @click="toKYText">专利拍卖（科易网）</el-button>
      <el-button v-show="!detailData._source.wid && !detailData._source.patno && !detailData._source.reqno" type="warning" plain size="mini" @click="toFullText">求助全文</el-button>
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
            <el-button v-show="detailData._source.wid || detailData._source.patno || detailData._source.reqno" type="warning" plain icon="el-icon-shopping-cart-2" @click="toPayLink">立即购买</el-button>
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
    this.imgPath(this.detailData._source.patt)
  },
  methods: {
    imgPath(patt) {
      console.log('imgPath > path', this.detailData._source.patt)
      switch (patt) {
        case '发明专利': { this.imgsrc = require('@/static/img/fmPatent.jpg'); break }
        case '实用新型': { this.imgsrc = require('@/static/img/syxxPatent.jpg'); break }
        case '外观设计': { this.imgsrc = require('@/static/img/wgsjPatent.jpg'); break }
        default: { this.imgsrc = require('@/static/img/paper.svg'); break }
      }
    },
    toPayLink() {
      console.log('支付链接:', this.detailData)
      var type = this.getPayLinkType(this.detailData._index)
      if (type === 'patent_') {
        console.log('dfsadfasdf', this.detailData._source.reqno)
        window.open((this.detailData._source.patno || this.detailData._source.reqno) ? 'http://oss.wanfangdata.com.cn/Fulltext/Download?fileId=patent_' + this.detailData._source.patno : 'http://oss.wanfangdata.com.cn/Fulltext/Download?fileId=patent_' + this.detailData._source.reqno, '_blank')
      } else {
        window.open('http://oss.wanfangdata.com.cn/Fulltext/Download?fileId=' + type + this.detailData._source.wid, '_blank')
      }
    },
    toFullText() {
      console.log('万方链接:', this.detailData)
      var type = this.getWFLinkType(this.detailData._index)
      if (this.detailData._source.patno) {
        window.open('http://d.wanfangdata.com.cn/patent/' + this.detailData._source.patno, '_blank')
      } else if (this.detailData._source.reqno) {
        window.open('http://d.wanfangdata.com.cn/patent/' + this.detailData._source.reqno, '_blank')
      } else {
        window.open('http://d.wanfangdata.com.cn/' + type + '/' + this.detailData._source.wid, '_blank')
      }
    },
    toZJUText() {
      console.log('ZJU链接:', this.detailData)
      var type = this.getWFLinkType(this.detailData._index)
      if (this.detailData._source.anno) {
        // eslint-disable-next-line
        window.open('https://worldwide.espacenet.com/publicationDetails/originalDocument?CC=CN&NR=' + this.detailData._source.anno.slice(2, ) + '&KC=A&FT=D&ND=&date=' + this.detailData._source.annodate.replace(/\-/g, '') + '&DB=EPODOC&locale=', '_blank')
      } else {
        window.open('http://d.wanfangdata.com.cn/' + type + '/' + this.detailData._source.wid, '_blank')
      }
    },
    toKYText() {
      console.log('KY链接:', this.detailData)
      if (this.detailData._source.patno) {
        // eslint-disable-next-line
        window.open('https://www.1633.com/patent/list.html?keyword=' + this.detailData._source.patno.slice(2, ), '_blank')
      } else if (this.detailData._source.reqno) {
        // eslint-disable-next-line
        window.open('https://www.1633.com/patent/list.html?keyword=' + this.detailData._source.reqno.slice(2, ), '_blank')
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
    },
    getPayLinkType() {
      switch (this.detailData._index) {
        case 'wf_mds_chn_qikan': {
          return 'perio_'
        }
        case 'wf_mds_chn_huiyi': {
          return 'conference_'
        }
        case 'wf_mds_en_huiyi': {
          return 'conference_'
        }
        // case 'wf_mds_chn_cstad': {
        //   return 'cstad'
        // }
        case 'wf_mds_chn_claw': {
          return 'legislations_'
        }
        // case 'wf_mds_chn_biaozhun': {
        //   return 'standard'
        // }
        case 'wf_mds_chn_zhuanli': {
          return 'patent_'
        }
        case 'wf_mds_en_zhuanli': {
          return 'patent_'
        }
        case 'f_mds_chn_xuewei': {
          return 'degree_'
        }
        default: {
          return 'patent_'
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
  .title {
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 136, 0);
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
