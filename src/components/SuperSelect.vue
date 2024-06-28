<script setup>
import { ref, watch } from 'vue'

const { tip, operator } = defineProps({
  tip: { type: String },
  operator: { type: Function }
})

const val = ref('')
function insertOption(e) {
  operator(val.value)
  e.target.value = ''
}

watch(val, () => {
    val.value = ''
})
</script>

<template>
    <select @change="insertOption($event)" v-model="val">
        <option style="display: none" value="">{{ tip }}</option>
        <slot></slot>
    </select>
</template>

<style scoped>
select {
    color: gray;
}
:slotted(option) {
    color: #eee;
}
</style>
