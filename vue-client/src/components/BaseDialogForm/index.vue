<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width?width:'40%'"
    :modal-append-to-body="false"
    append-to-body
    left>
    <el-form :model="executionDetail">
      <el-form-item label-position="top" label="反馈意见">
        <el-input v-model="executionDetail.content" type="textarea" rows="6" autocomplete="off"/>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseDialogForm',
  props: {
    title: { type: String, default: '' },
    width: { type: String, default: '' },
    visible: { type: Boolean, default: false },
    config: { type: Array, default: () => [] },
    formData: { type: Object, default: () => {} }},
  data() {
    return {
      formModel: {},
      dialogTitle: '',
      executionDetail: { content: '', attachUrl: '' }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(v) {
        this.$emit('changeDialog', v)
      }
    }
  },
  watch: {
    /* 实现表单数据的绑定，实时接收父组件的数据变化*/
    formData() {
      this.formModel = this.formData
    }
  },
  mounted() {
    // 将组件上的属性赋值给当前组件内变量，因为props只能单向绑定,还需要监听属性值变化进行父子组件间交互
    this.formModel = this.formData
    this.dialogTitle = this.title
  },
  methods: {
    // 提交表单数据
    submitForm() {
      this.$refs.configForm.validate((valid) => {
        if (valid) {
          // 让父组件接收到响应数据
          this.$emit('onSubmit', this.executionDetail)
          // 关闭模态框
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单状态
    resetForm() {
      if (this.$refs.configForm) {
        this.$refs.configForm.resetFields()
      }
    },
    // 展示模态框
    showDialog() {
      this.dialogVisible = true
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
