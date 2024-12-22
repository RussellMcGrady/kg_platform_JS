<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span class="card-title">文献推荐</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="toPaperResource">查看更多</el-button>
    </div>
    <div v-for="item in searchResult" :key="item._id" class="text item">
      <span style="color: #215DA9" @click="toPaperDetail(item)">{{ item._source.title?item._source.title.replace(/%/g,' '):'' }}</span>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { knowledgeService } from '@/api/resource/knowledge'

export default {
  name: 'Person',
  data() {
    return {
      pageNumber: 1,
      pageSize: 6,
      searchResult: []
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.searchResult = []
      const _this = this
      this.listLoading = true
      // indexName 需要改成传参形式
      var searchIndex = 'wf_mds_chn_qikan'
      var index = parseInt(10 * Math.random())
      var page = parseInt(10 * Math.random())
      var contentList = ['知识', '制造资源', '价值链协同', '资源共享', '专利价值', '云平台', '供应链', '产品服务', '工业互联网', '服务模式']
      var content = contentList[index]
      console.log('检索类别：', searchIndex)
      var params1 = {
        indexName: searchIndex,
        queryString: content,
        sortField: '',
        fields: '',
        pageNumber: page,
        pagePerNo: this.pageSize,
        facets: ''
      }
      console.log('检索内容：', params1)
      knowledgeService.queryWf(params1).then(res => {
        console.log('res:', res)
        var resData = JSON.parse(res.data)
        if (!resData.EsSearchResult || resData.EsSearchResult === '') {
          _this.searchResult = []
          return
        }
        resData = JSON.parse(resData.EsSearchResult)
        _this.searchResult = resData.hits.hits
        console.log('resWf:', _this.searchResult)
      }, err => {
        console.error('请求失败：', err)
      })

      /* // ninbo info higntech test
      var params2 = {
        UnitName: '宁波'
      }
      knowledgeService.queryNbHignTech(params2).then(res => {
        console.log('res:', res.data)
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })*/
    },
    toPaperDetail(row) {
      console.log('searchResult > toPaperDetail > 选中项：', row)
      this.$goRoute({ name: 'paperDetail', query: { detail: row }})
    },
    toPaperResource() {
      this.$goRoute({ name: 'paper' })
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
