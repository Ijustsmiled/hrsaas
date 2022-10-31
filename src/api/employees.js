// 员工接口

import request from '@/utils/request'

// 获取员工简单列表
export const getEmployeeSimple = () => {
  return request({
    method: 'GET',
    url: '/sys/user/simple'
  })
}
