import { keyBy } from '../utils'
const getters = {
    sidebarLogo: state => state.settings.sidebarLogo,
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    id: state => state.user.id,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    company_id: state => state.user.company_id,
    company_name: state => state.user.company_name,
    roles: state => state.user.roles,
    addRouters: state => state.user.addRouters,
    routers: state => state.user.routers,
    cachedViews: state => state.tagsView.cachedViews,
    visitedViews: state => state.tagsView.visitedViews,
    dictData: state => state.dictionary.dictData,
    currentEditFlow: state => state.flow.currentEditFlow,
    currentEditFlowFormItemList: state => state.flow.currentEditFlowFormItemList,
    flowTagList: state => state.flow.flowTagList,
    currentStartFormList: state => state.flow.currentStartFormList,
    currentStartFormData: state => state.flow.currentStartFormData,
    // 将数组转为对象
    currentStartFormDesc(state, getters) {
        return getters.currentStartFormList ?
            keyBy(getters.currentStartFormList, 'field') :
            null
    },
    employeeList: state => state.organization.employeeList,
    roleList: state => state.organization.roleList
}
export default getters