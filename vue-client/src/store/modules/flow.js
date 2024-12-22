import { flowTagService } from '../../api/flowExtend/flowTag'

const flow = {
  state: {
    // 当前选中的流程应用
    currentEditFlow: {},
    // 当前编辑的流程应用表单项列表
    currentEditFlowFormItemList: [],
    // 工作包列表
    flowTagList: [],
    // 当前流程应用的表单
    currentStartFormList: [],
    // 当前流程应用表单的值
    currentStartFormData: {}
  },
  mutations: {
    // 更新当前选中的流程应用
    updateCurrentEditFlowFormItemList(state, form) {
      state.currentEditFlowFormItemList = form
    },
    // 更新当前选中的流程应用
    updateCurrentFlow(state, flow) {
      // console.log('updateCurrentFlow')
      state.currentEditFlow = flow
    },
    // 更新工作包列表
    updateFlowTagList(state, user_id) {
      const params = {
        user_id: user_id
      }
      flowTagService.query(params).then(res => {
        state.flowTagList = res.data
      })
    },
    // 更新当前启动的流程的表单项列表
    updateCurrentStartFormList(state, formList) {
      state.currentStartFormList = formList
    },
    updateCurrentStartFormData(state, formData) {
      state.currentStartFormData = formData
    }
  },
  actions: {
  }
}

export default flow
