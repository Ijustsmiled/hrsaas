// 社保的路由规则

import Layout from '@/layout'

// 每个子模块，其实都是外层layout，组件位于layout的二级路由
export default {
  path: '/social',
  name: 'social',
  component: Layout,
  // 配置二级路由
  children: [{
    // 默认路由
    path: '',
    component: () => import('@/views/social'),
    // 路由元信息
    meta: {
      // 左侧导航把mate中的title为显示菜单名称
      title: '社保',
      icon: 'table'
    }
  }]
}
