<script setup>
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

defineProps({
  id: {
    type: String
  },
  label: {
    type: String
  },
  func: {
    type: Function
  }
})

// function ifunc(func) {
//   func()
// }

</script>

<template>
    <label :class="{ zh: locale === 'zh' }" :for="id">{{ label }}</label>
    <input @change="func($event)" :id type="file" accept="image/png, image/jpeg, image/webp">
</template>

<style scoped>
input {
	display: none;
}
label::after {
	content: 'Browse';
	font-size: .8em;
	color: #eee;
	background-color: transparent;
	border: 1px solid #444;
	padding: .34em .4em;
	cursor: pointer;
}
label.zh::after {
    content: '选择文件';
}
label:hover::after {
	background-color: #333;
	border-color: #eee
}
</style>