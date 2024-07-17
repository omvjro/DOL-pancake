import { reactive } from 'vue'

export const store = reactive({
  theme: localStorage.getItem('theme') || '',
  savedCode: JSON.parse(localStorage.getItem('savedCode')) || {
    widget: {},
    passage: {},
  },
  temp: localStorage.getItem('temp') || '',
  customWidgets: JSON.parse(localStorage.getItem('customWidgets')) || {}
})
