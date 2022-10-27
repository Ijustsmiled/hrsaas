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

export function getInfo(token) {

}

export function logout() {

}
