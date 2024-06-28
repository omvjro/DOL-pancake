<script setup>
import { ref } from 'vue'
import { colors } from '@/assets/data'
import {
    insertTarget,
    position, selection,
    insert, wrap
} from '@/assets/insert';
import SuperSelect from '../SuperSelect.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const insertOrWrap = (element) => {
  if (selection?.isCollapsed || !selection) {
    element.innerText = `\u200b${ t('inputPrompt') }`;
    insert(element);
  } else {
    wrap(element);
  }
};

function coloredOperator(v) {
    const span = document.createElement('span');
    span.classList.add(v);
    insertOrWrap(span);
}

function BIUOperator(v) {
    const element = document.createElement(v);
    insertOrWrap(element);
}

const linkClass = ref('normalLink'),
      linkTime = ref(''),
      linkTo = ref(''),
      linkEnd = ref('')

function insertLink() {
  const link = document.createElement('a');
  link.classList.add(linkClass.value);
  link.setAttribute('endevent', linkEnd.value);
  link.setAttribute('linkto', linkTo.value);
  link.setAttribute('linktime', linkTime.value);
  if (position?.startContainer.parentElement !== insertTarget) {
    selection.collapse(insertTarget);
  }
  if (selection?.isCollapsed || !selection) {
    link.innerText = `\u200b${ t('next') }`;
    if (linkTime.value !== '') link.innerText += ` (${Math.floor(linkTime.value / 60)}:${(`${linkTime.value % 60}`).padStart(2, '0')})`;
    insert(link);
  } else {
    wrap(link);
  }
}
</script>

<template>
<div class="item">
  {{ $t('insertColoredText') }}：
  <SuperSelect :tip=" $t('normal') " :operator="coloredOperator">
    <option v-for="color in colors.color" :class="color" :key="color">{{ color }}</option>
  </SuperSelect>
  <SuperSelect :tip=" $t('attitude') " :operator="coloredOperator">
    <option v-for="color in colors.statusColor" :class="color" :key="color">{{ color }}</option>
  </SuperSelect>
  <SuperSelect :tip=" $t('effected') " :operator="coloredOperator">
    <option v-for="color in colors.specialColor" :key="color[0]" :value="color[0]">{{ color[1] }}</option>
  </SuperSelect>
  <SuperSelect :tip=" $t('biu') " :operator="BIUOperator">
    <option value="b">{{ $t('bold') }}</option>
    <option value="i">{{ $t('italic') }}</option>
    <option value="u">{{ $t('underlined') }}</option>
  </SuperSelect>
</div>

<div class="item">
  {{ $t('insert') }}
  <select name="link" v-model="linkClass">
    <option value="normalLink">{{ $t('link') }}</option>
    <option value="nextWraith">{{ $t('wraithLink') }}</option>
  </select><temp hidden="1" class="advanced"><label for="linkTime">{{ $t('insertLink.1') }}</label>
  <input id="linkTime" v-model="linkTime" min="1" max="599" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value > 599) this.value = '599';">
  {{ $t('insertLink.2') }}<label for="linkTo">{{ $t('insertLink.3') }}</label>
  <input id="linkTo" v-model="linkTo" />
  <datalist id="linkToList"></datalist>
  {{ $t('insertLink.4') }}
  <select v-model="linkEnd">
    <option value="">{{ $t('insertLink.5') }}</option>
    <option value="endevent">{{ $t('insertLink.6') }}</option>
  </select>
  {{ $t('insertLink.7') }}</temp>
  <button class="small" @click="insertLink">{{ $t('confirm') }}</button>
</div>
</template>
