<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span class="card-title">所有评价 ({{ totalCount }}人)</span>
    </div>
    <div v-for="item in rateList" :key="item.label" style="display: flex;flex-direction: column;font-size: 14px;padding:10px 0">
      <div style="display: flex;flex-direction: row">
        <el-tooltip :content="item.tooltip" class="item" effect="dark" placement="top-start">
          <div style="width: 60px;flex:0 0 auto">{{ item.label }}: </div>
        </el-tooltip>
        <div style="flex:1 1 auto;">
          <el-rate
            v-model="item.value"
            :colors="colors"
            show-text
            disabled/>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
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
        { label: '有用性', value: 0, tooltip: '资源当前的使用价值和未来的潜在价值' },
        { label: '先进性', value: 0, tooltip: '资源理论、技术和方法的先进性' },
        { label: '质量', value: 0, tooltip: '资源的可信赖性、可靠性、规范性' }],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
      rateData: {
        use_score: 0,
        use_count: 0,
        lead_score: 0,
        lead_count: 0,
        quality_score: 0,
        quality_count: 0
      },
      totalCount: 0
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  mounted() {
    this.getCommentList()
  },
  methods: {
    getCommentList() {
      const _this = this
      const data = {
        label: '评价',
        resource_id: this.detailData.properties.NBid,
        skip: 0,
        limit: 20
      }
      var params = {
        data: JSON.stringify(data)
      }
      console.log('评价请求参数params:', JSON.stringify(params))
      knowledgeService.queryKgInterface(params).then(res => {
        console.log('获取评价结果', res)
        for (const i in _this.rateData) {
          _this.rateData[i] = 0
        }
        if (res.data.code === 20000) {
          console.log('获取评价结果', res)
          var nodes = res.data.data.nodes
          nodes.forEach((item, key) => {
            if (item.properties.use_score) {
              _this.rateData.use_score += Number(item.properties.use_score)
              _this.rateData.use_count++
            }
            if (item.properties.lead_score) {
              _this.rateData.lead_score += Number(item.properties.lead_score)
              _this.rateData.lead_count++
            }
            if (item.properties.quality_score) {
              _this.rateData.quality_score += Number(item.properties.quality_score)
              _this.rateData.quality_count++
            }
          })
          console.log('计算后的结果rateData：', _this.rateData)
          _this.rateList[0].value = Math.round(_this.rateData.use_score / _this.rateData.use_count)
          _this.rateList[1].value = Math.round(_this.rateData.lead_score / _this.rateData.lead_count)
          _this.rateList[2].value = Math.round(_this.rateData.lead_score / _this.rateData.lead_count)
          _this.totalCount = _this.rateData.use_count
          console.log('计算后的评价结果：', _this.rateList)
        }
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
</style>
