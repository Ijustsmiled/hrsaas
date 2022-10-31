// 组织架构接口

import request from '@/utils/request'

// 获取组织架构接口
export const getDepartments = () => {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}

// 删除组织架构接口
export const delDepartments = (id) => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}

// 添加组织架构接口
export const addDepartments = (data) => {
  return request({
    method: 'POST',
    // restful接口规范
    url: '/company/department',
    data
  })
}

// 获取部门详情
export const getDepartDetail = id => {
  return request({
    method: 'GET',
    url: `/company/department/${id}`
  })
}

// 编辑部门接口
export const updateDepartments = data => {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
