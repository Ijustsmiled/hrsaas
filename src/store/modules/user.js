import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// 状态
// 初始化的时候，从缓存中读取状态，并赋值到初始化状态上
const state = {
  // 设置初始化状态  token持久化 => 存放到缓存当中
  token: getToken(),
  // 定义一个空对象 存储获取的用户数据
  // 注意：因为需要在getters中使用到userInfo中的变量，如果使用null的话，会造成异常和报错
  userInfo: {}
}

// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    // 修改state数据
    state.token = token
    // vuex和缓存数据同步
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    // 删除vuex中的token
    state.token = null
    // 清除缓存token数据
    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, result) {
    // state.userInfo = result
    // 利用浅拷贝也能触发响应式
    state.userInfo = { ...result }
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {
  // 定义 login 方法 调用action时传递过来的参数
  async login(context, data) {
    // 发起登录请求
    const result = await login(data)
    // actions修改state 必须经过mutations
    context.commit('setToken', result)
    // 写入时间戳 将当前最新事件写入缓存
    setTimeStamp()
  },
  // 定义 getUserInfo 方法  获取用户资料
  async getUserInfo(context) {
    // 调用接口 获取用户资料
    const result = await getUserInfo()
    // 获取用户详情信息
    const baseInfo = await getUserDetailById(result.userId)
    // 将获取的用户资料设置到vuex中     合并数据
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result
  },
  // 退出登录操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

