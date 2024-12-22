<template>
  <el-card>
    <div style="height: 68px;padding:20px 0;">
      <div style="height:28px;padding:0 10px; line-height: 28px;border-left:5px solid #E6A23C">
        <span>评论</span>
      </div>
    </div>
    <el-input
      :autosize="{ minRows: 4, maxRows: 10}"
      v-model="coment"
      type="textarea"
      placeholder="请输入内容"/>
    <div style="display:flex;flex-direction: row;justify-content: flex-end;align-items: flex-end; height:68px;width:100%;padding:20px 0;">
      <el-button type="warning" plain>评论</el-button>
    </div>
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
      coment: ''
    }
  },
  computed: {
  },
  mounted() {
    // this.getCommentList()
    // this.getMyResource()
  },
  methods: {
    getCommentList() {
      const data = {
        label: '评价',
        resource_id: this.detailData.properties.id,
        skip: 0,
        limit: 100
      }
      var params = {
        data: JSON.stringify(data)
      }
      console.log('评价请求参数params:', JSON.stringify(params))
      knowledgeService.queryKgInterface(params).then(res => {
        console.log('获取评价结果', res)
        if (res.data.code === 20000) {
          console.log('获取评价结果', res)
        }
      })
    },
    getMyResource() {
      const _this = this
      var user_id = localStorage.getItem('id')
      const H = {
        label: '用户',
        id: user_id
      }
      const R = {
        label: '关联资源_期刊',
        skip: 0,
        limit: 10
      }
      var params = {
        H: JSON.stringify(H),
        R: JSON.stringify(R)
      }
      knowledgeService.queryRelationship(params).then(res => {
        console.log('获取关联的期刊列表', res)
        if (res.code === 20000) {
          _this.$notify({
            message: '评价成功',
            type: 'success',
            duration: 2000
          })
        } else {
          _this.$notify({
            message: '获取评价失败',
            type: 'error',
            duration: 2000
          })
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
