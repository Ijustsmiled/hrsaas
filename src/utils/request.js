import axios from 'axios'
import { Message } from 'element-ui'

// 创建 axios 实例
const service = axios.create({
  // 当执行 npm run dev => .evn.development => /api => 跨域处理
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置超时时间
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use()

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
  // 提示错误信息
  Message.error(error.message)
  // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  return Promise.reject(error)
})

export default service
