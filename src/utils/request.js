import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
// 定时token时效
const TimeOut = 3600

// 创建 axios 实例
const service = axios.create({
  // 当执行 npm run dev => .evn.development => /api => 跨域处理
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置超时时间
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 每个请求都需要携带token 在这个为止统一输入token
  if (store.getters.token) {
    // 判断token是否超时
    if (IsCheckTimeOut()) {
      // 删除缓存当中的token
      store.dispatch('user/logout')
      // 跳转登录页面
      router.push('/login')
      // 超时提示信息
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 注意：必须返回config
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios 默认给数据加了一层data
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    // 提示错误消息
    Message.error(message)
    // 业务已经错误了，代码运行应该进入catch()
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息里面的response对象  判断是否等于10002
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 等于10002 表示后端告诉我已经超时了  超时了执行退出登录，删除用户信息操作
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    // 提示错误信息
    Message.error(error.message)
  }
  // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  return Promise.reject(error)
})

// 封装判断超时函数
function IsCheckTimeOut() {
  // 获取当前时间戳
  const currentTime = Date.now()
  // 获取token缓存时间戳
  const timeStamp = getTimeStamp()
  // 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
