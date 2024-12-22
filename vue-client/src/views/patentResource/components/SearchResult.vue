<template>
  <div style="margin-bottom: 10px;">
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="searchData"
      :default-sort="{prop: 'date', order: 'descending'}"
      :row_style="{height: '40px'}"
      :cell-style="{height: '40px'}"
      height="600"
      tooltip-effect="dark"
      element-loading-text="Loading"
      highlight-current-row
    >
      <el-table-column align="center" type="index" label="序号" width="95" />
      <el-table-column label="名称" align="left" prop="title" width="250">
        <template slot-scope="scope">
          <span type="text" style="color: #215DA9" @click="toPatentDetail(scope.row)">{{ scope.row.properties.patentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发明人" width="150" align="left" prop="author">
        <template slot-scope="scope">{{ scope.row.properties.inventroName? scope.row.properties.inventroName:scope.row.properties.applyPersonName }}</template>
      </el-table-column>
      <el-table-column label="专利权所有者" width="250" align="left" prop="author">
        <template slot-scope="scope">{{ scope.row.properties.patentee }}</template>
      </el-table-column>
      <el-table-column label="出版号/公开号" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.properties.publicNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出版日期" align="center" prop="date" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.properties.publicDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效日期" align="center" prop="date" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.properties.expireDate }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="链接" align="center" width="400">
        <template slot-scope="scope">
          <el-link type="primary"><span>{{ 'http://d.wanfangdata.com.cn/patent/' + scope.row.properties._source.reqno }}</span><i class="el-icon-view el-icon&#45;&#45;right" /> </el-link>
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
    toPatentDetail(row) {
      console.log('searchResult > toPatentDetail > 选中项：', row)
      this.$goRoute({ name: 'patentDetail', query: { detail: row }})
    }
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
