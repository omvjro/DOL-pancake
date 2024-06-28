import './assets/game.css'
import './assets/style.css'
import './assets/iconfont.css'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './locales';

createApp(App).use(i18n).mount('#app')
