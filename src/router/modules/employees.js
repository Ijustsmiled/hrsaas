// 员工的路由规则

import Layout from '@/layout'

// 每个子模块，其实都是外层layout，组件位于layout的二级路由
export default {
  path: '/employees',
  // name: 'employees',
  component: Layout,
  // 配置二级路由
  children: [{
    // 默认路由
    path: '',
    component: () => import('@/views/employees'),
    // 路由元信息
    meta: {
      // 左侧导航把mate中的title为显示菜单名称
      title: '员工',
      icon: 'people'
    }
  }, {
    // ? 的含义时表示该参数可传可不传  动态路由参数
    path: 'detail/:id',
    component: () => import('@/views/employees/detail'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }, {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    mate: {
      title: '打印',
      icon: 'people'
    }
  }]
}
