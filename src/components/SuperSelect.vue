<script setup>
const { tip, operator } = defineProps({
  tip: { type: String },
  operator: { type: Function }
})

function insertOption(e) {
  operator(e.target.value)
  e.target.value = ''
}
</script>

<template>
    <select @change="insertOption($event)">
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
