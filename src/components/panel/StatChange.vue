<script setup>
import { ref, computed, watch } from 'vue'
import { insertHard } from '@/assets/insert'
import { statics } from '@/assets/data.js';
import { getOptionText } from '@/assets/utils';

const type = ref(Object.keys(statics)[0]),
      allStats = Object.values(statics).map((v) => Object.keys(v)).flat().filter((v) => v !== '_'),
      plus = ref('g'),
      visibleStats = computed(() => {
        return allStats.filter((s) => {
          return Object.keys(statics[type.value]).includes(s)
        })
      }),
      statName = ref(Object.keys(statics[type.value])[0]),
      npc = ref(),
      stat = computed(() => {
        return statics[type.value][statName.value]
      }),
      limit = computed(() => {
        return stat.value.limit || [3, 3]
      });

watch(type, (t) => {
  statName.value = Object.keys(statics[t]).filter((v) => v !== '_')[0]
})

function insertStatChange() {
  const isPlus = plus.value.includes('g');
  const value = stat.value.value === false ? undefined : (stat.value.value || statics[type.value]._?.value);
  let realStatName = statName.value;
  let realPlus = plus.value;

  if (stat.value.variant) {
    realPlus = isPlus ? plus.value.replaceAll('g', 'l') : plus.value.replaceAll('l', 'g');
    realStatName = stat.value.variant;
  }

  let valueType = stat.value.valueMacro || realStatName;
  if (type.value === 'npc') {
    valueType = `npcincr "${ stat.value.npc || npc.value || '' }" ${ stat.value.valueType || realStatName }`;
  }

  let code = `<<${realPlus}${realStatName}${stat.value.npcs && npc.value ? ` "${npc.value}"` : ''}>>`;
  const valueCode = value ? `<<${valueType} ${isPlus ? '' : '-'}${value[realPlus.length - 1]}>>` : '';
  let text = `${ getOptionText('statPlus') } ${
    getOptionText('statNPC') || ''
   }${ getOptionText('statName') }`;
  [text, , code] = stat.value.decorate?.({
    text, isPlus, code,
  }) || [text, isPlus, code];

  let color = (stat.value.colors || statics[type.value]._?.colors)?.[+!isPlus];
  color ??= isPlus ? 'red' : 'green';

  insertHard(` | <span class="${color}">${text}</span>`, code, (widget) => widget.setAttribute('valueCode', valueCode))
}
</script>

<template>
<div class="item">
  <label>{{ $t('insert') }}

  <select v-model="type" @change="updateStats">
    <option v-for="key in Object.keys(statics)" :key :value="key">{{ $t(`stats.${key}`) }}</option>
  </select>

  {{ $t('statChange') }}：</label>

  <select v-model="plus" id="statPlus">
    <option v-for="i in limit[0]" :key="i" :value="'g'.repeat(i)">
      {{ '+ '.repeat(i).trim() }}
    </option>
    <option v-for="i in limit[1]" :key="i" :value="'l'.repeat(i)">
      {{ '- '.repeat(i).trim() }}
    </option>
  </select>

  <select v-if="stat.npcs" v-model="npc" id="statNPC">
    <option></option>
    <option v-for="npc in stat.npcs" :key="npc" :value="npc">
      {{ $t(`npc.${npc}`) }}{{ $t(`npc.s`) }}{{ $i18n.locale === 'en' ? '&nbsp;' : '' }}
    </option>
  </select>

  <select v-model="statName" id="statName">
    <option v-for="stat in visibleStats" :key="stat" :value="stat">
      {{ $t(`stats.${stat}`) }}
    </option>
  </select>

  <button class="small" @click="insertStatChange">{{ $t('confirm') }}</button>
</div>
</template>

<style scoped>
</style>