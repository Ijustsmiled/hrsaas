// 专门处理权限路由的模块

import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  // 定义路由表  表示当前用户所拥有的所有路由的数组
  routes: constantRoutes
}
const mutations = {
  // 定义修改routes的mutations
  setRoutes(state, newRouter) {
    // 每次都是在静态路由的基础上去加新的路由
    state.routes = [...constantRoutes, ...newRouter]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出动态路由中和menus中能够对上的路由
    menus.forEach(key => {
      // key就是标识
      // asyncRoutes找 有没有对象中name属性等于key的 如果找不到就没有权限 如果找到了就要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 得到的routes是所有模块中满足权限的路由数组
    // routes就是当前用户所拥有的动态路由的权限
    context.commit('setRoutes', routes)
    // state数据  是用来显示左侧菜单用的  return 是给路由addRoutes用的
    return routes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
