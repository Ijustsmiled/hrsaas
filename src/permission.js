// 权限拦截在路由跳转  导航守卫

// 引入router实例
import router from '@/router'
// 引入store实例
import store from '@/store'
// 引入进度条
import NProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

// 定义白名单
const writeList = ['/login', '/404']

// 前置守卫  注意：next() 必须执行  如果不执行 页面就死了
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  //   判断是否有token
  if (store.getters.token) {
    // 如果有token下 要访问登录界面
    if (to.path === '/login') {
      // 直接跳转至首页
      next('/')
    } else {
      // 通过判断是否有用户id，验证是否具有用户资料
      if (!store.getters.userId) {
        // await 是使程序变成同步运行，必须先获取资料之后才可以跳转
        const { roles: { menus }} = await store.dispatch('user/getUserInfo')
        // 筛选用户可用路由
        const routes = await store.dispatch('permission/filterRoutes', menus)
        // 添加动态路由到路由表
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // 添加完动态路由之后
        // 相当于跳到对应的地址  相当于多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 判断没有token下访问的是否在白名单之内
    if (writeList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  //   关闭进度条
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})
