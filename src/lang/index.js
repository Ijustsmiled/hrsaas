// 多语言实例化文件
import Vue from 'vue'
// 引入国际化的包
import VueI18n from 'vue-i18n'
// 引入cookie包
import Cookie from 'js-cookie'
// 引入element的英文包
import elementEN from 'element-ui/lib/locale/lang/en'
// 引入element的中文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN'

// 引入自定义语言包
import customZH from './zh'
import customEN from './en'

Vue.use(VueI18n)
export default new VueI18n({
  locale: Cookie.get('language') || 'zh',
  messages: {
    en: {
      // 将element英文语言包引入
      ...elementEN,
      // 将自定义英文语言包引入
      ...customEN
    },
    zh: {
      // 将element中文语言包引入
      ...elementZH,
      // 将自定义中文语言包引入
      ...customZH
    }
  }
})
