// 员工接口

import request from '@/utils/request'

// 获取员工简单列表
export const getEmployeeSimple = () => {
  return request({
    method: 'GET',
    url: '/sys/user/simple'
  })
}

// 获取员工综合列表数据
export const getEmployeeList = params => {
  return request({
    method: 'GET',
    url: '/sys/user',
    params
  })
}

// 删除员工信息
export const delEmployee = id => {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

// 新增员工信息
export const addEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}

// 封装一个导入员工的接口 参数data是一个数组
export const importEmployee = data => {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

// 保存员工的基本信息
export const saveUserDetailById = data => {
  return request({
    method: 'PUT',
    url: `/sys/user/${data.id}`,
    data
  })
}

// 读取用户详情的基础信息
export const getPersonalDetail = (id) => {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

// 更新用户详情的基础信息
export const updatePersonal = (data) => {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

// 获取用户的岗位信息
export const getJobDetail = (id) => {
  return request({
    url: `/employees/${id}/jobs`
  })
}

// 保存岗位信息
export const updateJob = (data) => {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

// 给员工分配角色
export const assignRoles = data => {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data
  })
}
