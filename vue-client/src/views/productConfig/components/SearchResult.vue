<template>
  <div style="margin-bottom: 10px;">
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="searchData"
      :default-sort="{prop: 'date', order: 'descending'}"
      :row_style="{height: '40px'}"
      :cell-style="{height: '40px'}"
      height="1000"
      tooltip-effect="dark"
      element-loading-text="Loading"
      border
      highlight-current-row
      style="margin-top:5px;"
    >
      <el-table-column align="center" type="index" label="序号" width="95" />
      <el-table-column label="标题" align="left" prop="title" width="250">
        <template slot-scope="scope">
          <el-button type="text" style="color: #215DA9">{{ scope.row._source.title?scope.row._source.title.replace(/%/g,' '):scope.row._source.title }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" align="left" prop="author">
        <template slot-scope="scope">{{ scope.row._source.author? scope.row._source.author.replace(/%/g,' '):scope.row._source.author }}</template>
      </el-table-column>
      <!--<el-table-column label="摘要" align="center" width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row._source.abstract }}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="受保护项" align="center" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row._source.dom }}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="专利类型" align="center" prop="type" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row._source.patt }}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="申请号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row._source.reqno }}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="专利状态" align="center" prop="tag">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row._source.ls === '有权' ? 'success' : 'warning'"
            disable-transitions
          >{{ scope.row._source.ls }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="公开日期" align="center" prop="date" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row._source.annodate }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="时间" align="center" prop="date" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row._source.date }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="资源价值" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row._score }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="链接" align="center" width="400">
        <template slot-scope="scope">
          <el-link type="primary"><span>{{ 'http://d.wanfangdata.com.cn/patent/' + scope.row._source.reqno }}</span><i class="el-icon-view el-icon&#45;&#45;right" /> </el-link>
        </template>
      </el-table-column>-->
    </el-table>
    <!--<div v-for="item in 10" :key="item">
      <el-card shadow="hover" style="margin-bottom:10px;">
        <span class="card-first-title"> {{ '这是一个需求' + item }}</span>
        <div class="bottom clearfix">
          <span class="card-second-line"> {{ '这是一个需求描述' + item }}</span>
          <el-button type="text" class="button">查看详情</el-button>
        </div>
      </el-card>
    </div>-->
  </div>
</template>

<script>
export default {
  name: 'Demand',
  props: {
    listLoading: {
      type: Boolean,
      default: () => false
    },
    searchResult: {
      type: Array,
      default: () => []
    },
    count: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      pageNumber: 0,
      searchData: []
    }
  },
  watch: {
    searchResult() {
      console.log('searchResult:', this.searchResult)
      this.searchData = this.searchResult
      console.log('searchData:', this.searchData)
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .card-first-title {
    font-size: 16px;
    font-weight: 500;
  }
  .card-second-line {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

</style>
