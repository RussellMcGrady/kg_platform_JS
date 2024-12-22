<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span class="card-title">我的评价</span>
      <el-button :loading="commentLoading" style="float: right;" type="primary" size="mini" plain @click="commentResource">提交</el-button>
    </div>
    <div v-for="item in rateList" :key="item.label" style="display: flex;flex-direction: column;font-size: 14px;padding:10px 0">
      <div style="display: flex;flex-direction: row">
        <el-tooltip :content="item.tooltip" class="item" effect="dark" placement="top-start">
          <div style="width: 100px;flex:0 0 auto">{{ item.label }}: </div>
        </el-tooltip>
        <div style="flex:1 1 auto;">
          <el-rate
            v-model="item.value"
            :colors="colors"/>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { UUID } from '@/utils'
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
      commentLoading: false,
      activeType: 'paper',
      value: null,
      rateList: [
        { label: '创新程度', value: 0, tooltip: '该技术相对于现有技术的新颖度' },
        { label: '技术效果', value: 0, tooltip: '该技术能够解决的新的技术问题的难易或重要程度，或者是相对于现有技术在经济效益等方面的改进程度' },
        { label: '技术影响力', value: 0, tooltip: '该技术对后续其他技术的启示或借鉴作用' },
        { label: '技术可替代性', value: 0, tooltip: '该技术在当前是否存在能够解决相同或相似问题的替代技术' },
        { label: '技术成熟度', value: 0, tooltip: '该技术所处的发展阶段' },
        { label: '技术独立性', value: 0, tooltip: '该技术不需要依赖于其他技术或配套条件而可以单独实施的程度' },
        { label: '技术应用长度', value: 0, tooltip: '该技术可以应用于多大范围的领域中' },
        { label: '技术应用广度', value: 0, tooltip: '该技术在时间上的应用范围' },
        { label: '撰写质量', value: 0, tooltip: '专利的文本撰写质量是否能够抵御专利被无效的风险。' }],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'] // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  mounted() {
    this.getMyComment()
  },
  methods: {
    getMyComment() {
      const data = {
        label: '评价',
        user_id: localStorage.getItem('id'),
        resource_id: this.detailData._id,
        skip: 0,
        limit: 100
      }
      var params = {
        data: JSON.stringify(data)
      }
      console.log('评价请求参数params:', JSON.stringify(params))
      knowledgeService.queryKgInterface(params).then(res => {
        console.log('获取我的评价结果', res)
        if (res.data.code === 20000) {
          console.log('获取评价结果', res)
        }
      })
    },
    commentResource() {
      const _this = this
      this.commentLoading = true
      console.log('待评价的资源:', this.detailData)
      const user = {
        label: '用户',
        id: localStorage.getItem('id'),
        name: localStorage.getItem('name'),
        avatar: localStorage.getItem('avatar'),
        company_id: localStorage.getItem('company_id'),
        company_name: localStorage.getItem('company_name')
      }
      const resource = {
        label: '期刊',
        _id: this.detailData._id,
        _source: this.detailData._source
      }
      var id = UUID()
      const comment = {
        label: '评价',
        id: id,
        user_id: localStorage.getItem('id'),
        user_name: localStorage.getItem('name'),
        user_avatar: localStorage.getItem('avatar'),
        resource_id: this.detailData._id,
        resource_name: this.detailData._source.title.replace(/%/g, ' '),
        resource_type: this.getCommentResourceType(),
        total_score: 90,
        use_score: this.rateList[0].value,
        lead_score: this.rateList[1].value,
        quality_score: this.rateList[2].value
      }
      var params = {
        hUser: JSON.stringify(user),
        hResource: JSON.stringify(resource),
        hComment: JSON.stringify(comment)
      }
      console.log('评价请求参数params:', JSON.stringify(params))
      knowledgeService.wfKjComment2kg(params).then(res => {
        console.log('评价结果', res)
        if (res.data.code === 20000) {
          this.commentLoading = false
          _this.$notify({
            message: '评价成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.commentLoading = false
          _this.$notify({
            message: '评价失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    getCommentResourceType() {
      switch (this.detailData._index) {
        case 'wf_mds_chn_qikan': {
          return ['期刊']
        }
        case 'wf_mds_chn_huiyi': {
          return ['会议']
        }
        case 'wf_mds_en_huiyi': {
          return ['会议']
        }
        case 'wf_mds_chn_cstad': {
          return ['成果']
        }
        case 'wf_mds_chn_claw': {
          return ['法规']
        }
        case 'wf_mds_chn_biaozhun': {
          return ['标准']
        }
        case 'wf_mds_chn_zhuanli': {
          return ['专利']
        }
        case 'wf_mds_en_zhuanli': {
          return ['专利']
        }
        case 'wf_mds_chn_yinwen': {
          return ['引文']
        }
        case 'wf_mds_auth_new': {
          return ['作者']
        }
        default: {
          return ['期刊']
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
</style>
