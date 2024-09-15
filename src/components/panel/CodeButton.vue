<script setup>
import { getCode } from '@/assets/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function func() {
  const dolEditor = document.querySelector('div.passage');
  const output = document.querySelector('#output');
  const code = getCode(dolEditor.innerHTML, document.querySelector('#html-mode').checked);

  output.innerHTML = `${ t('copy.caption') }<div class="tempTip"></div>
  <pre contenteditable="${ navigator.userAgent.includes('Firefox') ? 'true' : 'plaintext-only' }" spellcheck="false"></pre>`;
  document.querySelector('#output pre').innerText = code;

  document.querySelector('#copyCode').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(code); } catch (err) {
      (document.querySelector('.tempTip').innerHTML = `<span class="red">${ t('copy.fail') }</span>`);
    }
  });
}
</script>

<template>
    <button id="code" @click="func">{{ $t('code') }}</button>
</template>
