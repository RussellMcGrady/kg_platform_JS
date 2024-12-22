<template>
  <el-input v-model="parentContent" placeholder="请输入内容">
    <el-button slot="append" type="warning" icon="el-icon-search" @click="onSearch">搜索</el-button>
  </el-input>
  <!-- <div style="width:120px; display: flex;flex-direction: column;margin-left: 10px;padding-top:28px;">
        <el-button type="warning" @click="toPublishDemand">发布需求</el-button>
      </div>-->
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
      parentContent: this.content,
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
    parentContent() {
      this.$emit('onUpdateContent', this.parentContent)
    }
  },
  mounted() {
  },
  methods: {
    onSearch() {
      this.$emit('onUpdateSearch', this.parentContent)
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
