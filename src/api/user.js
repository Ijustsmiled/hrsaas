import request from '@/utils/request'

// 登录请求接口封装
export const login = data => {
  return request({
    // 因为所有的接口都要跨域 表示所有的接口要带 /api
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 获取用户基本资料
export const getUserInfo = () => {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 获取用户详情信息
export const getUserDetailById = id => {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

export function logout() {

}
