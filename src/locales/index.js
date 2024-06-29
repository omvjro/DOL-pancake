import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'
import zhTW from './zh-TW.json'
import zhHK from './zh-HK.json'

let navigatorLanguage = navigator.language
if (navigatorLanguage === 'zh-CN') navigatorLanguage = 'zh'

const i18n = createI18n({
    locale: localStorage.getItem('locale') || navigatorLanguage,
    fallbackLocale: 'en',
    messages: {
      en,
      zh,
      'zh-TW' : zhTW,
      'zh-HK' : zhHK,
    },
    legacy: false
})

export default i18n
