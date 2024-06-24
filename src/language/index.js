import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const i18n = createI18n({
    locale: localStorage.getItem('lang') || navigator.language,
    fallbackLocale: 'en',
    messages: {
      en,
      zh
    }
})

export default i18n
