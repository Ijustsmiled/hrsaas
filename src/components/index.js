// 该文件负责所有的组件注册的全局注册

import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'

export default {
  install(Vue) {
    // 注册全局的通用栏逐组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    // 注册打印组件
    Vue.use(Print)
  }
}