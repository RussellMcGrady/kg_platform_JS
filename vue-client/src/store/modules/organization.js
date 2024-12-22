import { roleService } from '../../api/upms/roleInfo'
import { employeeService } from '../../api/upms/userInfo'

const organization = {
  state: {
    // 成员列表
    employeeList: [],
    // 角色列表
    roleList: []
  },
  mutations: {
    // 更新当前选中的流程应用
    updateEmployeeList(state) {
      employeeService.listAllEmployee().then(res => {
        console.log('成员列表：', res)
        state.employeeList = res.data
      })
    },
    updateRoleList(state) {
      roleService.listAllRoles().then(res => {
        console.log('角色列表：', res)
        state.roleList = res.data
      })
    }
  },
  actions: {
  }
}

export default organization
