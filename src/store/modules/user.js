import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

// 状态
// 初始化的时候，从缓存中读取状态，并赋值到初始化状态上
const state = {
  // 设置初始化状态  token持久化 => 存放到缓存当中
  token: getToken()
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

