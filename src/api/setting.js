// 公司设置接口

import request from '@/utils/request'

// 获取公司角色信息
export const getRoleList = params => {
  return request({
    method: 'GET',
    url: '/sys/role',
    params
  })
}

// 获取公司信息
export const getCompanyInfo = companyId => {
  return request({
    method: 'GET',
    url: `/company/${companyId}`
  })
}

// 删除角色信息
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}

// 修改角色信息
export const updateRole = data => {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}

// 获取角色详情
export const getRoleDetail = id => {
  return request({
    method: 'GET',
    url: `/sys/role/${id}`
  })
}

// 新增角色信息
export const addRole = data => {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}

// 给角色分配权限
export const assignPerm = data => {
  return request({
    method: 'PUT',
    url: '/sys/role/assignPrem',
    data
  })
}
