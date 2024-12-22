<template>
  <div style="display: flex;flex-direction: row;">
    <el-cascader
      v-model="reknType"
      :options="knType"
      placeholder="请选择"
      clearable
      filterable
      remote
      style="width: 300px"
      @change="onChange"
    />
    <el-input v-model="localContent" placeholder="请输入内容">
      <el-button slot="append" type="warning" icon="el-icon-search" @click="onSearch">
        搜索
      </el-button>
    </el-input>
  <!-- <div style="width:120px; display: flex;flex-direction: column;margin-left: 10px;padding-top:28px;">
        <el-button type="warning" @click="toPublishDemand">发布需求</el-button>
      </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMainHeader',
  props: {
    content: {
      type: String,
      default: () => ''
    }
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      title: '工业知识图谱平台',
      wh: '',
      count: 0,
      searchResult: [],
      reknType: 'name',
      knType: [{
        value: 'name',
        label: '姓名'
      }, {
        value: 'researchField',
        label: '研究领域'
      }, {
        value: 'professionName',
        label: '技术职称/学历'
      }, {
        value: '行政职务',
        label: '行政职务'
      }, {
        value: 'address',
        label: '所在地'
      }, {
        value: 'focus',
        label: '专研领域'
      }, {
        value: 'org',
        label: '工作单位'
      }, {
        value: '专家类型',
        label: '专家类型'
      }, {
        value: '技术领域',
        label: '技术领域'
      }, {
        value: '专家组',
        label: '专家组'
      }],
      // props: { multiple: true },
      drawer: false,
      isPreview: false,
      isShowExportData: false,
      isShowHtmlCode: false,
      isShowBatchDialog: false,
      isShowImportDialog: false,
      isShowremoteConfig: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar'])
  },
  watch: {
  },
  mounted() {
    // this.restaurants = this.loadAll()
  },
  methods: {
    onChange(reknType) {
      this.reknType = reknType
      // console.log('reknType发生了变化：：', this.reknType)
      this.$emit('typeChange', this.reknType)
    },
    onSearch() {
      this.$emit('onUpdateSearch', this.content)
    },
    toPublishDemand() {
      this.$goRoute({ name: 'publishDemand' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-header {
    height: 36px;
    line-height: 36px;
    width: 100%;
    background-color:#ffffff;
    color:#181818;
    display: flex;
    flex-direction: column;
    z-index:9999;
  }
  ::v-deep .el-input-group__append button.el-button {
    border-color: transparent;
    background-color: #E6A23C;
    border-radius: 0;
    color: white;
    border-top: 0;
    border-bottom: 0;
  }
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
</style>
