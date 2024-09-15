import { reactive } from 'vue'

export const store = reactive({
  theme: localStorage.getItem('theme') || '',
  savedCode: JSON.parse(localStorage.getItem('savedCode')) || {
    widget: {},
    passage: {},
  },
  temp: localStorage.getItem('temp') || '',
  customWidgets: JSON.parse(localStorage.getItem('customWidgets')) || {},
  scene: localStorage.getItem('scene') || 'default',
  captureFeat: false,
})

// watch(
//   () => store.scene,
//   (scene) => {
//     localStorage.setItem('scene', scene)
//   }
// )
