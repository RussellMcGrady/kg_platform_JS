<template>
  <el-dialog :visible.sync="_dialogFlowVisible" :append-to-body="true" :modal-append-to-body="false" title="新建流程模板" center width="500px">
    <el-form :model="flow">
      <el-form-item label-position="top" label="名称">
        <el-input v-model="flow.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label-position="top" label="可见范围">
        <el-select v-model="flow.auth" >
          <el-option label="工作区可见" value="all"/>
          <el-option label="指定成员可见" value="limited"/>
        </el-select>
      </el-form-item>
      <el-form-item label-position="top" label="描述">
        <el-input v-model="flow.description" type="textarea" autocomplete="off"/>
      </el-form-item>
      <el-form-item label-position="top">
        <div style="display: flex;flex-direction: row;">
          <el-dropdown @command="handleCommand">
            <el-button type="primary" plain>
              选择工作包<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in flowTagList" :key="item.id" :command="item">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div style="margin-left:20px;">{{ flow.flowTagName }}</div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelTag">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="addFlow">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { flowAppService } from '../../api/flowExtend/flowApp'
import { mapGetters } from 'vuex'
export default {
  name: 'FlowApp',
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    // 如果是在工作包下新建应用，需要传递工作包数据
    flowTag: {
      type: Array,
      default: () => []
    },
    // 从父组件传来的参数，判断是新增还是更新
    handleAddOrEdit: {
      type: String,
      default: () => 'add'
    }
  },
  data: function() {
    return {
      appId: '',
      loading: false,
      flow: {
        name: '',
        auth: 'all',
        icon: '',
        authMembers: {},
        description: '',
        flowTagId: null,
        flowTagName: ''
      }
    }
  },
  computed: {
    ...mapGetters(['flowTagList']),
    _dialogFlowVisible: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('close')
      }
    }
  },
  watch: {
    flowTag() {
      this.flow.flowTagId = this.flowTag[0] || ''
      this.flow.flowTagName = this.flowTag[1] || ''
    }
  },
  mounted() {
  },
  methods: {
    cancelTag() {
      this.$emit('close')
    },
    // 新建流程
    async addFlow() {
      this.loading = true
      const _this = this
      var params = {
        user_id: localStorage.getItem('id'),
        name: this.flow.name,
        icon: '',
        desscription: this.flow.description,
        tag_id: this.flow.flowTagId
      }
      // 新增流程
      await flowAppService.insertFlow(params).then((res) => {
        console.log('插入流程：', res)
        _this.appId = res.data.data.ID
        _this.loading = false
        _this.$emit('close')
        // 跳转到流程编辑界面
        _this.$goRoute({ name: 'editFlow', query: { appId: _this.appId, addOrEdit: 'add', flow: _this.flow }})
      })
    },
    handleCommand(command) {
      console.log('command:', command)
      this.flow.flowTagId = command.id
      this.flow.flowTagName = command.name
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

  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
