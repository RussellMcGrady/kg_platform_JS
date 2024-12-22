<template>
  <div style="margin-bottom: 10px;">
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="searchData"
      :row_style="{height: '40px'}"
      :cell-style="{height: '40px'}"
      height="600"
      tooltip-effect="dark"
      element-loading-text="Loading"
      border
      highlight-current-row
    >
      <el-table-column align="center" type="index" label="序号" width="95" />
      <el-table-column label="机构名称" align="left" prop="title" width="250">
        <template slot-scope="scope">
          <el-button type="text" style="color: #215DA9" @click="toServiceOrgDetail(scope.row)">{{ scope.row.properties.agencyName }}{{ scope.row.properties.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="服务状态" align="left" prop="author" width="100">
        <template slot-scope="scope">{{ scope.row.properties.agencystate }}</template>
      </el-table-column>
      <el-table-column label="地址" align="left" prop="author" width="300">
        <template slot-scope="scope">{{ scope.row.properties.unitAddress }}</template>
      </el-table-column>
      <el-table-column label="联系电话" align="left" prop="author" width="150">
        <template slot-scope="scope">{{ scope.row.properties.phone }}</template>
      </el-table-column>
      <el-table-column label="邮箱" align="left" prop="author" width="200">
        <template slot-scope="scope">{{ scope.row.properties.email }}</template>
      </el-table-column>
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
    toServiceOrgDetail(row) {
      console.log('searchResult > toServiceOrgDetail > 选中项：', row)
      this.$goRoute({ name: 'serviceOrgDetail', query: { detail: row }})
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
