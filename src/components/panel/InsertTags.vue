<script setup>
import { ref } from 'vue'
import { insert, insertHard } from '@/assets/insert'
import { useI18n } from 'vue-i18n';
import SuperSelect from '@/components/SuperSelect.vue'

const { t } = useI18n()

const colors = {
  lewd: [
    'teal',
    'lblue',
    'blue',
    'purple',
    'pink',
    'red',
  ],

  trans: {
    wolfgirl: 'blue',
    cat: 'blue',
    cow: 'blue',
    harpy: 'gold',
    fox: 'orange',
    angel: 'gold',
    fallenangel: 'black',
    demon: 'red',
  },

  others: {
    crime: 'red',
    defianttext: 'def',
    dangerousText: 'red',
  },
}

const sexFlav = {
  wolfgirl: 'wolfboy',
  harpy: 'bird',
  fox: 'vixen',
}

const lewdType = ref('exhibitionist'),
      lewdGrade = ref('1');

function insertLewd() {
  let text = `${ t(`lewd.${lewdType.value}`) } ${ t(`lewdGrade.${lewdGrade.value}`) }`;
  if (lewdGrade.value === 6) text = `!${text}!`;
  insertHard(` | <span class="${colors.lewd[lewdGrade.value - 1]}">${text}</span>`, `<<${lewdType.value}${lewdGrade.value}>>`);
}

function operator(type, value) {
  const realVal = Object.values(sexFlav).includes(value) ?
                  Object.keys(sexFlav)[Object.values(sexFlav).indexOf(value)]
                : value
  insertHard(
    ` | <span class="${colors[type][realVal]}">${ t(`tags.${value}`) }</span>`,
    `<<${ realVal }>>`,
  )
}

const transOperator = operator.bind(null, 'trans')
const othersOperator = operator.bind(null, 'others')

function symbolsOperator(symbol) {
  insert(document.createTextNode(symbol), true, symbol === '£');
}
</script>

<template>
<div class="item">
  {{ $t('insertLewd') }}：
  <select v-model="lewdType">
    <option value="exhibitionist">{{ $t('lewd.exhibitionist') }}</option>
    <option value="promiscuous">{{ $t('lewd.promiscuous') }}</option>
    <option value="deviant">{{ $t('lewd.deviant') }}</option>
  </select>
  <select v-model="lewdGrade">
    <option v-for="key in 6" :key :value="key">
        {{ $t(`lewdGrade.${key}`) }}
    </option>
  </select>
  <button class="small" @click="insertLewd">{{ $t('confirm') }}</button>
</div>

<div class="item">{{ $t('insertOther') }}：
  <SuperSelect :tip=" $t('tags.trans') " :operator="transOperator">
    <template v-for="t in Object.keys(colors.trans)" :key="t">
      <option :value="t">
        {{ $t(`tags.${t}`) }}
      </option>
      <option v-if="sexFlav[t]" :value="sexFlav[t]">
        {{ $t(`tags.${sexFlav[t]}`) }}
      </option>
    </template>
  </SuperSelect>
  <SuperSelect :tip=" $t('tags.others') " :operator="othersOperator">
    <option v-for="t in Object.keys(colors.others)" :key="t" :value="t">
      {{ $t(`tags.${t}`) }}
    </option>
  </SuperSelect>
  <SuperSelect :tip=" $t('symbols') " :operator="symbolsOperator">
    <option value=" | ">|</option>
    <option>£</option>
  </SuperSelect>
</div>
</template>
