<template>
  <div id="app" class="my-app">
    <head-menu @onUpdateSearch="onUpdateSearch" />
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-main style="padding:0 20px 20px 20px;overflow-y: auto;">
        <el-card shadow="never">
          <el-page-header content="详情页面" @back="goBack" />
        </el-card>
        <detail :detail-data="detailData" />
        <comment :detail-data="detailData" />
      </el-main>
      <el-aside width="300px">
        <!-- <person/>-->
        <all-comment :detail-data="detailData" class="right-module" />
        <my-comment :detail-data="detailData" class="right-module" />
        <!--<paper-recommend class="right-module"/>-->
      </el-aside>
    </div>
  </div>
</template>

<script>
import HeadMenu from '../main/components/Header'
import { knowledgeService } from '@/api/resource/knowledge'
// import SearchResult from './components/SearchResult'
// import PaperRecommend from './components/PaperRecommend'
// import ExpertRecommend from './components/ExpertRecommend'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Detail from './components/detail'
import Comment from './components/comment'
// import Person from './components/Person'
import MyComment from './components/myComment'
import AllComment from './components/allComment'
export default {
  name: 'App',
  components: {
    HeadMenu,
    // SearchResult,
    // PaperRecommend,
    // ExpertRecommend,
    MyComment,
    // Pagination,
    Detail,
    Comment,
    // Person,
    AllComment
  },
  data() {
    return {
      detailData: this.$route.query.detail,
      activeIndex: 1,
      category: '',
      content: '',
      sortField: '',
      listLoading: false,
      searchResult: [],
      count: 0,
      pageNumber: 1,
      pageSize: 20,
      radio: 'related'
    }
  },
  watch: {
  },
  mounted() {
    console.log('mainSearch > category', this.category)
    // this.onSearch()
    // this.getExpert()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    onUpdateSearch(category, content) {
      this.category = category
      this.content = content
      this.onSearch()
    },
    onSearch() {
      this.searchResult = []
      const _this = this
      this.listLoading = true
      // indexName 需要改成传参形式
      var params1 = {
        indexName: 'wf_mds_chn_qikan,wf_mds_en_qikan,wf_mds_chn_huiyi,wf_mds_en_huiyi,wf_mds_chn_cstad,wf_mds_chn_zhuanli,wf_mds_en_zhuanli,wf_mds_chn_biaozhun,wf_mds_chn_claw,wf_mds_chn_yinwen,wf_mds_auth_new',
        queryString: this.content,
        sortField: this.sortField,
        fields: '',
        pageNumber: this.pageNumber,
        pagePerNo: this.pageSize,
        facets: ''
      }
      knowledgeService.queryWf(params1).then(res => {
        console.log('res:', res)
        var resData = JSON.parse(res.data)
        if (!resData.EsSearchResult || resData.EsSearchResult === '') {
          _this.searchResult = []
          _this.count = 0
          _this.listLoading = false
          return
        }
        resData = JSON.parse(resData.EsSearchResult)
        _this.searchResult = resData.hits.hits
        console.log('resWf:', _this.searchResult)
        _this.count = resData.hitsCount
        _this.listLoading = false
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
        _this.listLoading = false
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
    goBack() {
      this.$router.back(-1)
    },
    getExpert() {
      const params1 = {
        label: '专家',
        skip: 0,
        limit: 10
      }
      knowledgeService.queryLabel(params1).then(res => {
        console.log('res:', res)
      })
      const params2 = {
        user: '专家',
        skip: 0,
        limit: 10
      }
      knowledgeService.wfKjComment2kg(params2).then(res => {
        console.log('res:', res)
      })
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
  .my-app{
    background-color: rgb(238, 238, 238);
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }
  .right-module{
    margin-top: 10px;
  }
</style>
