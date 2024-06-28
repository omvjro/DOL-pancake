import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

const i18n = createI18n({
    locale: localStorage.getItem('locale') || navigator.language,
    fallbackLocale: 'en',
    messages: {
      en,
      zh
    },
    legacy: false
})

export default i18n
