<script setup>
import { ref } from 'vue'
import { insertHard } from '@/assets/insert'
import { getOptionText } from '@/assets/utils';

import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const diffiColors = {
  very_easy: 'green',
  easy: 'teal',
  medium: 'lblue',
  challenging: 'blue',
  hard: 'purple',
  very_hard: 'pink',
  impossible: 'red',
};

const name = ref('skulduggery'),
      diff = ref('very_easy'),
      customName = ref(''),
      customVar = ref('');

function insertSkillCheck() {
  let code;
  let realName = name.value;

  if (realName !== 'custom') {
    code = `<<${realName}difficulty>>`;
  } else {
    realName = customName.value;
    code = `<<skill_difficulty \`${customVar.value}\` "${realName}">>`;
  }

  insertHard(` | <span class="orange">${
    realName !== customName.value ? getOptionText('skillCheckName') : customName.value
  }</span>${
    locale.value === 'en' ? ': ' : '：'
  }<span class="${diffiColors[diff.value]}">${
    getOptionText('skillCheckDiff')
  }</span>`, code);
}

</script>

<template>
<div class="item">
  {{ $t('insertSkillChecks') }}：
  <select v-model="name" id="skillCheckName">
    <option v-for="skill in [
        'skulduggery',
        'physique',
        'willpower',
        'english',
        'swimming',
        'athletics',
        'tending',
        'housekeeping',
        'dance',
        'custom',
    ]" :key="skill" :value="skill">
      {{ $t(`skill.${skill}`) }}
    </option>
  </select>
  <select v-model="diff" id="skillCheckDiff">
    <option v-for="diff in [
        'very_easy',
        'easy',
        'medium',
        'challenging',
        'hard',
        'very_hard',
        'impossible',
    ]" :key="diff" :value="diff">
      {{ $t(`skillDiff.${diff}`) }}
    </option>
  </select>
  <template v-if="name === 'custom'">
    <input v-model="customName" type="text" class="custom" :placeholder=" $t('skillCheck.name') ">
    <input v-model="customVar" type="text" class="custom" :placeholder=" $t('skillCheck.var') ">
  </template>
  <button @click="insertSkillCheck" id="skill-check" class="small">{{ $t('confirm') }}</button>
</div>
</template>

<style scoped>
</style>