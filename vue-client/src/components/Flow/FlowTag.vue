<template>
  <el-dialog :visible.sync="_dialogTagVisible" :append-to-body="true" :modal-append-to-body="false" title="新建分组" center width="500px">
    <el-form :model="flowTag">
      <el-form-item label-position="top" label="名称">
        <el-input v-model="flowTag.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label-position="top" label="可见范围">
        <el-select v-model="flowTag.auth" >
          <el-option label="工作区可见" value="all"/>
          <el-option label="指定成员可见" value="limited"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelTag">取 消</el-button>
      <el-button type="primary" @click="addFlowTag">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { flowTagService } from '../../api/flowExtend/flowTag'
export default {
  name: 'FlowTag',
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    // 从父组件传来的参数，判断是新增还是更新
    handleAddOrEdit: {
      type: String,
      default: () => 'add'
    },
    // 从父组件传来的参数，如果是更新，获取原来的标签数据
    flowTag: {
      type: Object,
      default: function() {
        return {
          name: '',
          auth: 'all',
          icon: '',
          authMembers: {}
        }
      }
    }
  },
  data: function() {
    return {
    }
  },
  computed: {
    _dialogTagVisible: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('close')
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    cancelTag() {
      this.$emit('close')
    },
    // 添加表单
    async addFlowTag() {
      const _this = this
      console.log('flowTag:', this.flowTag)
      const params = this.flowTag
      flowTagService.insert(params).then(res => {
        console.log('flowTagInsert:', res)
        // 更新工作包列表
        _this.$store.commit('updateFlowTagList', localStorage.getItem('id'))
        _this.$emit('close')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-input{
    width: 100% !important;
  }

  .el-select{
    width: 100% !important;
  }
</style>
